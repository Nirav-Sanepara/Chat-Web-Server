import jwt from "jsonwebtoken";
import { MESSAGES } from "./config";

export const decodeToken = async (token, req, res) => {
  try {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY);
    return tokenData;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

export const generateToken = async (data) => {
  try {
    const token = jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: "4h", // Set token expiration time (adjust as needed)
    });
    return token;
  } catch (error) {
    console.error("Token generation failed:", error);
    throw new Error(MESSAGES.BAD_REQUEST);
  }
};
