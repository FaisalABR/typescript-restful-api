import { Request, Response, NextFunction } from "express";
import {
  CreateRequestLogin,
  CreateRequestUser,
  UpdateRequestUser,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import { UserRequest } from "../type/user-type";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateRequestUser = req.body as CreateRequestUser;
      const response = await UserService.register(request);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateRequestLogin = req.body as CreateRequestLogin;
      const response = await UserService.login(request);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user!);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateRequestUser = req.body as UpdateRequestUser;
      const response = await UserService.update(req.user!, request);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.logout(req.user!);

      res.status(200).json({
        data: "OK",
      });
    } catch (error) {
      next(error);
    }
  }
}
