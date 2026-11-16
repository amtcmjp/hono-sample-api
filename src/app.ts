import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { cors } from "hono/cors";
import users from "./features/users/user.route.js";
import { compressionMiddleware } from "./middlewares/compression.js";
import { errorMiddleware } from "./middlewares/error-handler.js";
import { performanceMiddleware } from "./middlewares/performance.js";
import { requestIdMiddleware } from "./middlewares/request-id.js";

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
const app = new Hono();

app.use(performanceMiddleware);
app.use(requestIdMiddleware);
app.use(logger());
app.use(secureHeaders());
app.use(cors(corsOptions));
// app.use(rateLimitMiddleware);
app.use(compressionMiddleware);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Hono API is running!",
  });
});

app.route("/api/users", users);
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Route not found",
    },
    404,
  );
});
app.onError(errorMiddleware);

export default app;
