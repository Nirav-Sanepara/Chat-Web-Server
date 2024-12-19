import express from "express";
import userRoutes from "../app/user/user.routes.js";
import conversationRoutes from "../app/conversation/conversation.routes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/conversation", conversationRoutes);

export default router;
