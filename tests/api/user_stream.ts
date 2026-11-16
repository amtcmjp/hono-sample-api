import { postApiStream } from "./client";

const payload = {
  message: "Hello",
};

const status = await postApiStream("/users/stream", payload, (chunk) => {
  console.log(chunk);
});
console.log("\nStatus:", status);
