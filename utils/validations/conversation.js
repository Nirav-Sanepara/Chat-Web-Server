import Joi from "joi";

export const createConversationSchema = Joi.object({
  isGroup: Joi.boolean().required(),
  participants: Joi.array().items(Joi.string()).min(2).max(10).required(),
  groupName: Joi.string()
    .trim()
    .when("isGroup", {
      is: true,
      then: Joi.allow(null).required(),
      otherwise: Joi.allow(null).optional(),
    }),
  // groupImage: Joi.string().uri().allow(null, ""),
  content: Joi.string().allow("").required(),
  media: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      type: Joi.string().valid("image", "video", "pdf", "doc").required(),
      url: Joi.string().trim().required(),
    }),
  ),
});

export const updateConversationSchema = Joi.object({
  participants: Joi.array().items(Joi.string()).min(2).optional(),
  groupName: Joi.string()
    .trim()
    .when("isGroup", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .optional(),
  // groupImage: Joi.string().uri().allow(null, "").optional(),
});

export const sendMessageSchema = Joi.object({
  conversation: Joi.string().required(),
  sender: Joi.string().required(),
  content: Joi.string().allow(""),
  media: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      type: Joi.string().valid("image", "video", "pdf", "doc").required(),
      url: Joi.string().trim().required(),
    }),
  ),
});

export const socketSendMessageSchema = Joi.object({
  conversation: Joi.string().required(),
  sender: Joi.string().required(),
  content: Joi.string().allow(""),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid("image", "pdf").required(),
      url: Joi.string().trim().required(),
    }),
  ),
});

export const getMessagesSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
  pinned: Joi.boolean(),
});

export const forwardMessageSchema = Joi.object({
  messageId: Joi.string().required(),
  newConversationIds: Joi.array().items(Joi.string()).min(1).required(),
});

export const markMessageAsRead = Joi.object({
  userId: Joi.string().required(),
});
