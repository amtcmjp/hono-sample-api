import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

type ValidationTarget = "json" | "query" | "param" | "header" | "form";

export const validate = <T extends ZodType>(
  target: ValidationTarget,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      console.error("Validation failed:", result.error.issues);
      return c.json(
        {
          success: false,
          message: "Validation failed",
          // errors: result.error.issues.map((issue) => ({
          //   field: issue.path.join("."),
          //   message: issue.message,
          // })),
        },
        400,
      );
    }
    return;
  });
