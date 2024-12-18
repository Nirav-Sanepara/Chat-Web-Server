import { MESSAGES, STATUS } from "../config/index";
import { decodeToken } from "../helper";
import User from "../models/User";

export const auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    const token = authorizationHeader
      ? authorizationHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.UNAUTHORIZED });
    }

    const tokenData = await decodeToken(token);
    if (!tokenData) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.UNAUTHORIZED });
    }

    const user = await User.findOne({
      email: tokenData.email,
    })
      .select("email")
      .lean();

    if (!user) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.UNAUTHORIZED });
    }

    // Attach the user to the request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(STATUS.FORBIDDEN).json({ message: MESSAGES.FORBIDDEN });
  }
};
