import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    media: [
      {
        name: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: ["image", "video", "pdf", "doc"],
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    readBy: {
      type: Map,
      of: Boolean,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        reactionBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reaction: {
          type: String,
          default: null,
        },
      },
    ],
    isDeleted: {
      type: Map,
      of: Boolean,
    },
    // isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);

export default Message;
