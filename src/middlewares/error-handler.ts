import type { ErrorHandler } from "hono";
import { AppError } from "../lib/errors/app-error.js";

export const errorMiddleware: ErrorHandler = (error, c) => {
  if (error instanceof AppError) {
    return c.json(
      {
        success: false,
        message: error.message,
      },
      error.statusCode,
    );
  }

  console.error("Unhandled error:", error);
  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500,
  );
};
