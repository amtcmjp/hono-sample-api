import { getApi, printResponse } from "./client.js";

const result = await getApi("/users");

printResponse("User List", result);
