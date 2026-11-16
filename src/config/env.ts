import { z } from "zod";

import { appErrors } from "../lib/errors/errors.js";

const envSchema = z.object({
  AWS_REGION: z.string().default("ap-northeast-1"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw appErrors.envInvalid();
}

export const env = Object.freeze(parsedEnv.data);
