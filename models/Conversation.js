import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, default: null },
    isDeleted: {
      type: Map,
      of: Boolean,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
