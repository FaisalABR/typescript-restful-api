import { Address, Contact, User } from "@prisma/client";
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

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "testtest",
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: "test",
        last_name: "test",
        email: "test@example.com",
        phone: "08222",
        username: "testtest",
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: "testtest",
      },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    return contact;
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "testtest",
        },
      },
    });
  }

  static async create() {
    const contact = await ContactTest.get();

    const address = await prismaClient.address.create({
      data: {
        contact_id: contact.id,
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "test",
      },
    });

    return address;
  }

  static async get(): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        contact: {
          username: "testtest",
        },
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    return address;
  }
}
