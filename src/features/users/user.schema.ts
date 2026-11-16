import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(100, { error: "Name must not exceed 100 characters" }),

  email: z.email({
    error: "Invalid email address",
  }),

  age: z
    .number({
      error: "Age must be a number",
    })
    .int({ error: "Age must be an integer" })
    .min(1, { error: "Age must be at least 1" })
    .max(120, { error: "Age must not exceed 120" }),
});

export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one property must be provided",
  });

export const userIdSchema = z.object({
  id: z.uuid({
    error: "Invalid user ID",
  }),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof createUserSchema>;
