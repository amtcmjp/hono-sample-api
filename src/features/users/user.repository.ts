import { defineTable } from "../../lib/dynamodb/index.js";
import { User } from "./user.types.js";

const userTable = defineTable<User, "user_id">({
  name: "test_user",
  key: ["user_id"],
});

type UserUpdate = Partial<Omit<User, "user_id">>;

export const userRepository = {
  async save(user: User): Promise<User> {
    await userTable.create(user);
    return user;
  },
  async findAll(): Promise<User[]> {
    return userTable.scan();
  },
  async findById(user_id: string): Promise<User | undefined> {
    return userTable.get({ user_id });
  },
  async findByEmail(email: string): Promise<Pick<User, "email"> | undefined> {
    const emails = await userTable.queryAll({
      index: "GSI_email_index",
      partition: {
        email: email,
      },
      select: ["email"],
    });
    return emails[0];
  },
  async update(user_id: string, fields: UserUpdate): Promise<User | undefined> {
    return await userTable.update({ user_id }, { set: fields });
  },
  async delete(user_id: string): Promise<boolean> {
    await userTable.delete(
      { user_id },
      { condition: { attribute: "user_id", exists: true } },
    );
    return true;
  },
};
