import { CustomError, handleError } from "../../common/error/customError.js";
import { MESSAGES, RESOURCES, STATUS } from "../../config/index.js";
import User from "../../models/User.js";
import { generateToken } from "../../helper.js";

export class UserRepository {
  constructor() {}

  async addUser(data) {
    try {
      const existingUser = await User.findOne({ email: data.email }).lean();

      if (existingUser) {
        throw new CustomError(MESSAGES.exists("User"), STATUS.BAD_REQUEST);
      }

      const user = new User(data);
      await user.save();
      return { id: user._id };
    } catch (error) {
      console.log("🚀 ~ UserRepository ~ addUser ~ error:", error.code);
      if (error.code === 11000) {
        throw new CustomError(
          MESSAGES.exists(RESOURCES.USER),
          STATUS.BAD_REQUEST,
        );
      }
      handleError(error);
    }
  }

  async login(data) {
    try {
      const user = await User.findOne({ email: data.email }).lean();
      if (!user) {
        throw new CustomError(MESSAGES.notFound(RESOURCES.USER), 404);
      }

      const token = await generateToken({ email: data.email });
      return token;
    } catch (error) {
      handleError(error);
    }
  }
}
