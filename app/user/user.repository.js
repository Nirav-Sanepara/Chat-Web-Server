import { CustomError, handleError } from "../../common/error/customError";
import { MESSAGES, RESOURCES, STATUS } from "../../config";
import User from "../../models/User";

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
      if (error.code === 11000) {
        throw new CustomError(
          MESSAGES.exists(RESOURCES.USER),
          STATUS.BAD_REQUEST,
        );
      }
      handleError(error);
    }
  }
}
