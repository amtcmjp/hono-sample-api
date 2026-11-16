import { Hono } from "hono";

import { validate } from "../../middlewares/validate.js";

import {
  createUserSchema,
  paginationSchema,
  userIdSchema,
} from "./user.schema.js";

import { streamText } from "hono/streaming";
import { HTTP_STATUS, response } from "../../lib/http/index.js";
import { userService } from "./user.service.js";

const users = new Hono();

users.post("/stream", async (c) => {
  const { message } = await c.req.json<{
    message: string;
  }>();

  if (!message?.trim()) {
    return c.json({ message: "Message is required." }, 400);
  }

  return streamText(c, async (stream) => {
    for (let i = 1; i <= 50; i++) {
      await stream.write(`Message ${i}\n`);
      // await stream.sleep(10);
    }
  });
});

users.get("/", validate("query", paginationSchema), async (c) => {
  const { page, limit } = c.req.valid("query");

  const data = await userService.findAll();

  const start = (page - 1) * limit;

  return c.json({
    success: true,
    data: data.slice(start, start + limit),
  });
});

users.get("/:id", validate("param", userIdSchema), async (c) => {
  const { id } = c.req.valid("param");

  const user = await userService.findById(id);

  if (!user) {
    return c.json(response.error("User not found"), HTTP_STATUS.NOT_FOUND);
  }

  return c.json(response.success(user));
});

users.post("/", validate("json", createUserSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await userService.create(body);

  return c.json(response.success(user), HTTP_STATUS.CREATED);
});

users.delete("/:id", validate("param", userIdSchema), async (c) => {
  const { id } = c.req.valid("param");

  const deleted = await userService.delete(id);

  if (!deleted) {
    return c.json(response.error("User not found"), HTTP_STATUS.NOT_FOUND);
  }

  return c.json({
    success: true,
    message: "User deleted successfully",
  });
});

export default users;
