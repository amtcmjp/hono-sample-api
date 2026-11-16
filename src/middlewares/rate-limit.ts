import { rateLimiter } from "hono-rate-limiter";

export const rateLimitMiddleware = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    return c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  },

  handler: (c) => {
    return c.json(
      {
        success: false,
        message: "Too many requests. Please try again later.",
      },
      429,
    );
  },
});
