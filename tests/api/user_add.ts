import { callApi, printResponse } from "./client";

const users = Array.from({ length: 1 }, (_, index) => ({
  name: `Test User ${index + 1}`,
  email: `Ttestuser${index + 1}@example.com`,
  age: Math.floor(Math.random() * 40) + 18,
}));

for (const [index, payload] of users.entries()) {
  const result = await callApi("/users", payload);

  printResponse(`User Create ${index + 1}`, result);
}
