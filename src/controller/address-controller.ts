import { Response, NextFunction } from "express";
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressService } from "../service/address-service";
import { UserRequest } from "../type/user-type";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;
      request.contact_id = Number(req.params.contactId);

      const response = await AddressService.create(req.user!, request);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      };

      const response = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
      request.contact_id = Number(req.params.contactId);
      request.id = Number(req.params.addressId);

      const response = await AddressService.update(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      };

      const response = await AddressService.remove(req.user!, request);
      res.status(200).json({
        data: "OK",
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const response = await AddressService.list(req.user!, contactId);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
