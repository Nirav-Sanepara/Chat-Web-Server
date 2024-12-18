import { MESSAGES, RESOURCES, STATUS } from "../../config";
import { UserServices } from "./user.service";

/*
user.router.js (Authorization, Authentication, routers)
user.controller.js (orchestrators - call service don't contain logic) - They handle the HTTP status codes as part of this response too.
user.service.js (business logic, it should not contain any logic of db data fetching)
user.repository.js (for access to data)
*/

export class UserController {
  constructor() {
    this.userService = new UserServices();
  }

  async singUp(req, res, next) {
    try {
      const result = await this.userService.singUp(req.body);
      return res
        .status(STATUS.CREATED)
        .json({ message: MESSAGES.created(RESOURCES.USER), id: result.id });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
