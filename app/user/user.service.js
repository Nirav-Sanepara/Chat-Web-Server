import { UserRepository } from "./user.repository.js";
import { CustomError, handleError } from "./../common/error/customError.js";
import { loginSchema, signUpSchema } from "../../utils/validations/user.js";

export class UserServices {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(payload) {
    try {
      const { error, value } = signUpSchema.validate(payload);
      console.log("🚀 ~ UserServices ~ signUp ~ value:", value, payload);
      if (error) {
        throw new CustomError(error.message, 400, error.details);
      }

      const result = await this.userRepository.addUser(value);

      return result;
    } catch (error) {
      handleError(error);
    }
  }

  async login(payload) {
    try {
      const { error, value } = loginSchema.validate(payload);
      if (error) {
        throw new CustomError(error.message, 400, error.details);
      }
      const result = await this.userRepository.login(value);
      return result;
    } catch (error) {
      handleError(error);
    }
  }

  async listAllUsers() {
    try {
      const result = await this.userRepository.listAllUsers();
      return result;
    } catch (error) {
      handleError(error);
    }
  }
}
