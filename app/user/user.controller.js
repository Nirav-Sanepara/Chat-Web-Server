import { MESSAGES, RESOURCES, STATUS } from "../../config/index.js";
import { UserServices } from "./user.service.js";

export class UserController {
  constructor() {
    this.userService = new UserServices();
  }

  async singUp(req, res, next) {
    try {
      const result = await this.userService.signUp(req.body);
      return res
        .status(STATUS.CREATED)
        .json({ message: MESSAGES.created(RESOURCES.USER), id: result.id });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.userService.login(req.body);
      return res.status(STATUS.OK).json({
        token: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async listAllUsers(req, res, next) {
    try {
      const user = await this.userService.listAllUsers();
      return res.status(STATUS.OK).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
