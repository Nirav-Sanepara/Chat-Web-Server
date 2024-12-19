import { ConversationRepository } from "./conversation.repository.js";
import { CustomError, handleError } from "../../common/error/customError.js";
import {
  createConversationSchema,
  getMessagesSchema,
  sendMessageSchema,
  updateConversationSchema,
} from "../../utils/validations/conversation.js";
import { MESSAGES, STATUS } from "../../config/index.js";

export class ConversationServices {
  constructor() {
    this.conversationRepository = new ConversationRepository();
  }

  async createConversation(payload, loggedInUserId) {
    try {
      payload.participants = [...payload.participants, loggedInUserId];

      const { error, value } = createConversationSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, STATUS.BAD_REQUEST, error.details);
      }

      const { isGroup, participants } = value;

      // Ensure at least two participants for a conversation
      if (!isGroup && participants.length !== 2) {
        const errMsg = "A single chat must include exactly two participants.";

        throw new CustomError(errMsg, STATUS.BAD_REQUEST);
      }

      const savedConversation =
        await this.conversationRepository.createConversation(
          value,
          loggedInUserId,
        );
      return savedConversation;
    } catch (error) {
      handleError(error);
    }
  }

  async getConversationById(id, loggedInUserId) {
    try {
      const conversation =
        await this.conversationRepository.getConversationById(
          id,
          loggedInUserId,
        );

      if (!conversation) {
        throw new CustomError(
          MESSAGES.NOT_FOUND("Conversation"),
          STATUS.NOT_FOUND,
        );
      }

      return conversation;
    } catch (error) {
      handleError(error);
    }
  }

  async fetchUserConversations(query, loggedInUserId) {
    try {
      const { page = 1, limit = 10, search } = query;

      const filter = {
        participants: loggedInUserId,
        $and: [
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
        ],
      };

      const participantSearch = {};

      if (search) {
        const orCondition = {
          $or: [
            {
              groupName: { $regex: search, $options: "i" },
            },
          ],
        };

        filter.$and.push(orCondition);

        participantSearch.$or = [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            email: { $regex: search, $options: "i" },
          },
        ];
      }

      // Pagination and sorting
      const skip = (page - 1) * limit;

      const { conversations, totalPages } =
        await this.conversationRepository.fetchPaginatedConversations(
          filter,
          skip,
          limit,
          participantSearch,
        );

      return { conversations, totalPages };
    } catch (error) {
      handleError(error);
    }
  }

  async updateConversation(id, payload, loggedInUserId) {
    try {
      const { error, value } = updateConversationSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, STATUS.BAD_REQUEST, error.details);
      }

      await this.conversationRepository.updateConversation(
        id,
        value,
        loggedInUserId,
      );
    } catch (error) {
      handleError(error);
    }
  }

  async deleteConversation(id, loggedInUserId) {
    try {
      await this.conversationRepository.deleteConversation(id, loggedInUserId);
    } catch (error) {
      handleError(error);
    }
  }

  async markConversationAsRead(id, loggedInUserId) {
    try {
      await this.conversationRepository.markConversationAsRead(
        id,
        loggedInUserId,
      );
    } catch (error) {
      handleError(error);
    }
  }

  async sendMessage(payload, loggedInUserId) {
    try {
      const { error, value } = sendMessageSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, STATUS.BAD_REQUEST, error.details);
      }

      await this.conversationRepository.sendMessage(value, loggedInUserId);
    } catch (error) {
      handleError(error);
    }
  }

  async getMessages(conversationId, payload, loggedInUserId) {
    try {
      const { error, value } = getMessagesSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, STATUS.BAD_REQUEST, error.details);
      }

      const messages =
        await this.conversationRepository.getMessagesByConversationId(
          conversationId,
          value,
          loggedInUserId,
        );

      return messages;
    } catch (error) {
      handleError(error);
    }
  }
}
