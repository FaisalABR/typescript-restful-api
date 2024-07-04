import { User } from "@prisma/client";
import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

export class UserUtil {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "testtest",
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        username: "testtest",
        name: "testtest",
        password: await bcrypt.hash("testtest", 10),
        token: "testtest",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        username: "testtest",
      },
    });

    if (!user) {
      throw new Error("User is not found");
    }

    return user;
  }
}
