export const STATUS = {
  OK: 200,
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  REDIRECT: 307,
};

export const MESSAGES = {
  created: (resource) => `${resource} created successfully`,
  updated: (resource) => `${resource} updated successfully`,
  deleted: (resource) => `${resource} deleted successfully`,
  notFound: (resource) => `${resource} not found`,
  exists: (resource) => `${resource} already exists`,
  invalid: (resource) => `Invalid ${resource}`,
  required: (resource) => `${resource} is required`,
  notAllowed: (resource) => `${resource} not allowed to perform this action`,
  successfully: (resource) => `${resource} successfully`,
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
};

export const RESOURCES = {
  USER: "user",
  CONVERSATION: "conversation",
  MESSAGE: "message",
};
