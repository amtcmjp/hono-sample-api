import { compress } from "hono/compress";

export const compressionMiddleware = compress({
  encoding: "gzip",
});
