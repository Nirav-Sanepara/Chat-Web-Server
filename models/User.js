import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    // For Conversations to track user is online or not
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index("email");

const User = model("User", UserSchema);

export default User;
