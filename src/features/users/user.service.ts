import { appErrors } from "../../lib/errors/errors.js";
import { currentDateTime } from "../../lib/time/time.js";
import { userRepository } from "./user.repository.js";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.js";
import { User } from "./user.types.js";

export const userService = {
  async findAll(): Promise<User[]> {
    return await userRepository.findAll();
  },

  async findById(id: string): Promise<User | undefined> {
    return userRepository.findById(id);
  },

  async create(input: CreateUserInput): Promise<User> {
    const email = this.normalizeEmail(input.email);
    if (await this.isEmailExists(email)) {
      throw appErrors.emailAlreadyExists();
    }
    const now = currentDateTime();
    const user: User = {
      user_id: crypto.randomUUID(),
      ...input,
      email,
      created_at: now,
    };
    return await userRepository.save(user);
  },

  async update(id: string, input: UpdateUserInput): Promise<User | undefined> {
    if (input.email !== undefined && (await this.isEmailExists(input.email))) {
      throw appErrors.emailAlreadyExists();
    }
    return userRepository.update(id, input);
  },

  async delete(id: string): Promise<boolean> {
    return userRepository.delete(id);
  },

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  },

  async isEmailExists(email: string): Promise<boolean> {
    const user = await userRepository.findByEmail(email);
    return user !== undefined;
  },
};
