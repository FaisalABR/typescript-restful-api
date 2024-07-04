import { User } from "@prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  token?: string;
};

export type CreateRequestUser = {
  username: string;
  password: string;
  name: string;
};

export type CreateRequestLogin = {
  username: string;
  password: string;
};

export type UpdateRequestUser = {
  password?: string;
  name?: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    username: user.username,
  };
}
