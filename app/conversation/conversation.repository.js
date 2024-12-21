import mongoose from "mongoose";
import { CustomError, handleError } from "./../common/error/customError.js";
import Conversation from "../../models/Conversation.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import {
  MESSAGES,
  RESOURCES,
  // SOCKET_MESSAGE_EVENTS,
  STATUS,
} from "../../config/index.js";
import { getCurrentTimeStamp } from "../../utils/dates.js";

export class ConversationRepository {
  constructor() {}

  async createConversation(payload, loggedInUserId) {
    console.log("CourierRepository ~ createConversation ~ payload:", payload);
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const readByMap = new Map();
      readByMap.set(loggedInUserId, true);

      if (!payload.isGroup) {
        const conversation = await Conversation.findOne({
          isGroup: payload.isGroup,
          participants: {
            $all: payload.participants,
          },
        });

        if (conversation) {
          if (payload.content || payload.media?.length) {
            const newMessage = new Message({
              conversation: conversation._id,
              sender: loggedInUserId,
              readBy: readByMap,
              ...(payload.content && { content: payload.content }),
              ...(payload.media && { media: payload.media }),
            });

            conversation.lastMessage = newMessage._id;
            conversation.lastMessageAt = newMessage.createdAt;

            await Promise.all([
              newMessage.save({ session }),
              conversation.save({ session }),
            ]);
          }
          /*
          const [populatedData] = await Promise.all([
            newMessage.populate([
              {
                path: "sender",
                select: "_id name email avatar",
              },
              {
                path: "conversation",
                populate: {
                  path: "participants",
                },
              },
            ]),
            conversation.populate([
              {
                path: "participants",
                select: "name email avatar verified cognitoId",
              },
              {
                path: "lastMessage",
                select: "content media readBy",
              },
            ]),
          ]);

          const receivers = conversation?.participants
            ?.map((participant) => {
              return participant?.cognitoId;
              // if (participant._id.toString() !== loggedInUserId) {
              //   return participant.cognitoId;
              // }
            })
            .filter(Boolean);

          await this.socketServices.emitMessageToUser(
            SOCKET_MESSAGE_EVENTS.MESSAGE_RECEIVED,
            receivers,
            populatedData,
          );
          */

          await session.commitTransaction();

          return conversation;
        }
      }

      const newConversation = new Conversation(payload);

      const newMessage = new Message({
        conversation: newConversation._id,
        sender: loggedInUserId,
        readBy: readByMap,
        ...(payload.content && { content: payload.content }),
        ...(payload.media && { media: payload.media }),
      });

      newConversation.lastMessage = newMessage._id;
      newConversation.lastMessageAt = newMessage.createdAt;

      await Promise.all([
        newConversation.save({ session }),
        newMessage.save({ session }),
      ]);
      /*

      const [populatedData] = await Promise.all([
        newMessage.populate([
          {
            path: "sender",
            select: "_id name email avatar",
          },
          {
            path: "conversation",
            populate: {
              path: "participants",
            },
          },
        ]),
        newConversation.populate([
          {
            path: "participants",
            select: "name email avatar verified cognitoId",
          },
          {
            path: "lastMessage",
            select: "content media readBy",
          },
        ]),
      ]);

      const receivers = newConversation?.participants
        ?.map((participant) => participant._id.toString())
        .filter(Boolean);

        
        await this.socketServices.emitMessageToUser(
          SOCKET_MESSAGE_EVENTS.MESSAGE_RECEIVED,
          receivers,
          populatedData,
        );
        */

      await session.commitTransaction();
      return newConversation;
    } catch (error) {
      await session.abortTransaction();
      handleError(error);
    } finally {
      await session.endSession();
    }
  }

  async getConversationById(id, loggedInUserId) {
    try {
      const conversation = await Conversation.findOne({
        _id: id,
        participants: loggedInUserId,
        $or: [
          {
            [`isDeleted.${loggedInUserId}`]: { $exists: false },
          },
          {
            [`isDeleted.${loggedInUserId}`]: false,
          },
        ],
      })
        .populate("participants", "name email avatar")
        .lean();

      return conversation;
    } catch (error) {
      handleError(error);
    }
  }

  async fetchPaginatedConversations(filter, skip, limit) {
    try {
      const conversations = await Conversation.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate([
          {
            path: "participants",
            select: "name email avatar verified cognitoId",
          },
          {
            path: "lastMessage",
            select: "content media readBy",
          },
        ])
        .sort({ lastMessageAt: -1 })
        .lean();

      const totalConversations = await Conversation.countDocuments(filter);
      const totalPages = Math.ceil(totalConversations / limit);

      return { conversations, totalPages };
    } catch (error) {
      handleError(error);
    }
  }

  async updateConversation(id, value, loggedInUserId) {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const conversation = await Conversation.findOne({
        _id: id,
        participants: loggedInUserId,
      });

      if (!conversation) {
        throw new CustomError(
          MESSAGES.notFound(RESOURCES.CONVERSATION),
          STATUS.NOT_FOUND,
        );
      }

      const { groupName, participants } = value;

      if (conversation.isGroup) {
        if (groupName !== undefined) {
          conversation.groupName = groupName;
        }

        if (participants !== undefined) {
          conversation.participants = participants;
        }

        // if (groupImage !== undefined) {
        //   conversation.groupImage = groupImage;
        // }
      } else {
        if (groupName !== undefined || participants !== undefined) {
          throw new CustomError(
            "Updates to participants or group name are not allowed for your conversations.",
            STATUS.FORBIDDEN,
          );
        }
      }

      await conversation.save({ session });
      await session.commitTransaction();
      return conversation;
    } catch (error) {
      await session.abortTransaction();
      handleError(error);
    } finally {
      await session.endSession();
    }
  }

  async deleteConversation(id, loggedInUserId) {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      const conversation = await Conversation.findOne({
        _id: id,
        participants: loggedInUserId,
      });

      if (!conversation) {
        throw new CustomError(
          MESSAGES.notFound(RESOURCES.CONVERSATION),
          STATUS.NOT_FOUND,
        );
      }

      await Conversation.findByIdAndUpdate(
        id,
        { $set: { [`isDeleted.${loggedInUserId}`]: true } },
        { session },
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      handleError(error);
    } finally {
      await session.endSession();
    }
  }

  async markConversationAsRead(conversationId, loggedInUserId) {
    try {
      //Get latest 5 messages from the conversation to mark them as read
      const messages = await Message.find({
        conversation: conversationId,
        participants: loggedInUserId,
      })
        .sort({ createdAt: -1 })
        .select("_id")
        .limit(5);

      if (!messages.length) {
        throw new CustomError(
          MESSAGES.notFound("messages in the conversation"),
          STATUS.NOT_FOUND,
        );
      }

      const messagePromises = messages.map((message) => {
        message.readBy.set(loggedInUserId, true);
        return message.save();
      });

      await Promise.all(messagePromises);
    } catch (error) {
      handleError(error);
    }
  }

  async sendMessage(payload, loggedInUserId) {
    console.log(
      "CourierRepository ~ sendMessage ~ payload:",
      payload,
      loggedInUserId,
    );
    try {
      const conversation = await Conversation.findOne({
        _id: payload?.conversation,
        participants: loggedInUserId,
      })
        .select("_id participants")
        .populate("participants", "cognitoId");

      if (!conversation) {
        throw new CustomError(
          MESSAGES.notFound(RESOURCES.CONVERSATION),
          STATUS.NOT_FOUND,
        );
      }

      const sender = await User.exists({ _id: payload.sender });

      if (!sender) {
        throw new CustomError(MESSAGES.notFound("sender"), STATUS.NOT_FOUND);
      }

      // if (payload.sender !== loggedInUserId) {
      //   throw new CustomError(MESSAGES.UNAUTHORIZED, STATUS.UNAUTHORIZED);
      // }

      const readByMap = new Map();
      // readByMap.set(loggedInUserId, true);
      readByMap.set(payload.sender, true);

      const newMessage = new Message({
        ...payload,
        readBy: readByMap,
      });

      conversation.lastMessage = newMessage._id;
      conversation.lastMessageAt = getCurrentTimeStamp();

      await Promise.all([newMessage.save(), conversation.save()]);

      /*
      const populatedData = await newMessage.populate([
        {
          path: "sender",
          select: "_id name email avatar",
        },
        {
          path: "conversation",
          populate: {
            path: "participants",
          },
        },
      ]);

      const receivers = conversation?.participants
        ?.map((participant) => {
          return participant?.cognitoId;
          // if (participant._id.toString() !== loggedInUserId) {
          //   return participant.cognitoId;
          // }
        })
        .filter(Boolean);

      if (!receivers.length) {
        return;
      }

      await Promise.all(
        receivers.map((userId) => {
          this.socketServices.emitEvent(
            userId,
            SOCKET_MESSAGE_EVENTS.MESSAGE_RECEIVED,
            populatedData,
          );
        }),
      );
      */
    } catch (error) {
      console.log("CourierRepository ~ sendMessage ~ error:", error);
      handleError(error);
    }
  }

  async getMessagesByConversationId(conversationId, payload, loggedInUserId) {
    try {
      const { page, limit } = payload;
      const conversation = await Conversation.findById({
        _id: conversationId,
        participants: loggedInUserId,
      })
        .select("_id")
        .lean();

      if (!conversation) {
        throw new CustomError(
          MESSAGES.notFound(RESOURCES.CONVERSATION),
          STATUS.NOT_FOUND,
        );
      }

      const skip = (page - 1) * limit;

      const andCondition = [
        { conversation: conversationId },
        {
          $or: [
            {
              [`isDeleted.${loggedInUserId}`]: { $exists: false },
            },
            {
              [`isDeleted.${loggedInUserId}`]: false,
            },
          ],
        },
      ];

      if (payload.pinned) {
        andCondition.push({ isPinned: true });
      }

      const messages = await Message.find({
        $and: andCondition,
      })
        .select(
          "_id conversation sender content media isPinned reactions createdAt readBy",
        )
        .populate([
          {
            path: "sender",
            select: "_id name email avatar",
          },
          {
            path: "conversation",
            populate: {
              path: "participants",
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalMessages = await Message.countDocuments({
        $and: andCondition,
      });

      return {
        messages,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
        },
      };
    } catch (error) {
      handleError(error);
    }
  }
}
