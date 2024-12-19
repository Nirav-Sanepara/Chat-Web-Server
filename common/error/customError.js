import { STATUS } from "../../config/index.js";

export class CustomError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} statusCode
   * @param {object} details
   */
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @param {Error} error
 */
export const handleError = (error) => {
  // TODO: Need to also log payload and other details for tracing the error
  if (error instanceof CustomError) {
    throw error;
  }
  console.log("Unexpected error", error);
  throw new CustomError(
    "An unexpected error occurred",
    STATUS.INTERNAL_SERVER_ERROR,
    null,
  );
};
