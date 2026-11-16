import { createMiddleware } from "hono/factory";

const SLOW_REQUEST_THRESHOLD = 500;

export const performanceMiddleware = createMiddleware(async (c, next) => {
  const start = performance.now();

  await next();

  const duration = performance.now() - start;

  c.header("Server-Timing", `app;dur=${duration.toFixed(2)}`);

  if (duration >= SLOW_REQUEST_THRESHOLD) {
    console.warn("Slow request detected:", {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: `${duration.toFixed(2)} ms`,
    });
  }
});
