import { UserRepository } from "./user.repository";
import { CustomError, handleError } from "../../common/error/customError";
import { signUpSchema } from "../../utils/validations/user";

export class UserServices {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(payload) {
    try {
      const { error, value } = signUpSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, 400, error.details);
      }

      const result = await this.userRepository.addUser(value);

      return result;
    } catch (error) {
      handleError(error);
    }
  }
}
