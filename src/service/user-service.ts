import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateRequestLogin,
  CreateRequestUser,
  UpdateRequestUser,
  UserResponse,
  toUserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export class UserService {
  static async register(request: CreateRequestUser): Promise<UserResponse> {
    // Validasi Data terlebih dahulu
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    // berapa banyak username
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    // Check apakah ada username yang sama atau tidak
    if (totalUserWithSameUsername != 0) {
      // Handle Errornya
      throw new ResponseError(400, "Username has taken");
    }

    // hashing password
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // buat usernya didatabase
    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    // return response nya
    return toUserResponse(user);
  }

  static async login(request: CreateRequestLogin): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "password or username is wrong");
    }

    const passwordIsValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!passwordIsValid) {
      throw new ResponseError(401, "password or username is wrong");
    }

    user = await prismaClient.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;

    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateRequestUser
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }

  static async logout(user: User): Promise<UserResponse> {
    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return toUserResponse(result);
  }
}
