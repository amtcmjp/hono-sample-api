import { AppError } from "./app-error.js";

export const appErrors = {
  emailAlreadyExists: () =>
    new AppError("Email already exists", {
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
    }),

  userNotFound: () =>
    new AppError("User not found", {
      statusCode: 404,
      code: "USER_NOT_FOUND",
    }),
  envInvalid: () =>
    new AppError("Invalid environment variables", {
      statusCode: 500,
      code: "dev_env_invalid",
    }),
  invalidCursor: () =>
    new AppError("Invalid cursor", {
      statusCode: 400,
      code: "invalid_cursor",
    }),
  transactWriteError: (message: unknown) =>
    new AppError(String(message), {
      statusCode: 500,
      code: "TRANSACT_WRITE_ERROR",
    }),
  batchWriteError: (message: unknown) =>
    new AppError(String(message), {
      statusCode: 500,
      code: "BATCH_WRITE_ERROR",
    }),
  invalidCondition: () =>
    new AppError("Invalid condition", {
      statusCode: 400,
      code: "invalid_condition",
    }),
  invalidQueryInput: () =>
    new AppError("Invalid input", {
      statusCode: 400,
      code: "invalid_query",
    }),
};
