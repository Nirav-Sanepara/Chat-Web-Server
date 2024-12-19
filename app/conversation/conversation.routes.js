import express from "express";
import ConversationController from "./conversation.controller.js";
import { auth } from "../../middleware/index.js";

const router = express.Router();

router.post(
  "/create",
  auth,
  ConversationController.createConversation.bind(ConversationController),
);
router.get(
  "/:id",
  auth,
  ConversationController.getConversationById.bind(ConversationController),
);
router.patch(
  "/:id",
  auth,
  ConversationController.updateConversation.bind(ConversationController),
);
router.delete(
  "/:id",
  auth,
  ConversationController.deleteConversation.bind(ConversationController),
);
router.get(
  "/my-conversations/list",
  auth,
  ConversationController.getConversations.bind(ConversationController),
);
router.patch(
  "/mark-as-read/:id",
  auth,
  ConversationController.markConversationAsRead.bind(ConversationController),
);
router.get(
  "/:conversationId/messages",
  auth,
  ConversationController.getMessages.bind(ConversationController),
);

router.post(
  "/messages",
  auth,
  ConversationController.sendMessage.bind(ConversationController),
);

export default router;
