import { MESSAGES, RESOURCES, STATUS } from "../../config/index.js";
import { ConversationServices } from "./conversation.service.js";

export class ConversationController {
  constructor() {
    this.conversationService = new ConversationServices();
  }

  async createConversation(req, res, next) {
    try {
      const conversation = await this.conversationService.createConversation(
        req.body,
        req.user._id.toString(),
      );

      return res.status(STATUS.CREATED).json({
        message: MESSAGES.created(RESOURCES.CONVERSATION),
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationById(req, res, next) {
    try {
      const conversation = await this.conversationService.getConversationById(
        req.params.id,
        req.user._id.toString(),
      );
      return res.status(STATUS.OK).json({ conversation });
    } catch (error) {
      next(error);
    }
  }

  async updateConversation(req, res, next) {
    try {
      await this.conversationService.updateConversation(
        req.params.id,
        req.body,
      );
      return res
        .status(STATUS.SUCCESS)
        .json({ message: MESSAGES.updated(RESOURCES.CONVERSATION) });
    } catch (error) {
      next(error);
    }
  }

  async deleteConversation(req, res, next) {
    try {
      await this.conversationService.deleteConversation(
        req.params.id,
        req.user._id.toString(),
      );
      return res
        .status(STATUS.SUCCESS)
        .json({ message: MESSAGES.deleted(RESOURCES.CONVERSATION) });
    } catch (error) {
      next(error);
    }
  }

  async getConversations(req, res, next) {
    try {
      const conversations =
        await this.conversationService.fetchUserConversations(
          req.query,
          req.user._id.toString(),
        );
      return res.status(STATUS.SUCCESS).json({ conversations });
    } catch (error) {
      next(error);
    }
  }

  async markConversationAsRead(req, res, next) {
    try {
      await this.conversationService.markConversationAsRead(
        req.params.id,
        req.user._id.toString(),
      );
      return res
        .status(STATUS.SUCCESS)
        .json({ message: MESSAGES.updated(RESOURCES.CONVERSATION) });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      await this.conversationService.sendMessage(
        req.body,
        req.user._id.toString(),
      );

      return res
        .status(STATUS.CREATED)
        .json({ message: MESSAGES.created(RESOURCES.MESSAGE) });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;

      const messages = await this.conversationService.getMessages(
        conversationId,
        req.query,
        req.user._id.toString(),
      );

      return res.status(STATUS.OK).json({
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ConversationController();
