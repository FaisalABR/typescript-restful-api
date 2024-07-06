import { User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ContactService } from "./contact-service";
import { ResponseError } from "../error/response-error";
import { toContactResponse } from "../model/contact-model";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );

    const address = await prismaClient.address.create({
      data: createRequest,
    });

    return toAddressResponse(address);
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );

    const address = await prismaClient.address.findFirst({
      where: {
        id: getRequest.id,
        contact_id: getRequest.contact_id,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address not found");
    }

    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );

    const address = await prismaClient.address.findFirst({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address not found");
    }

    const updateAddress = await prismaClient.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id,
      },
      data: updateRequest,
    });

    return toAddressResponse(updateAddress);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(
      AddressValidation.DELETE,
      request
    );

    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id
    );

    const address = await prismaClient.address.findFirst({
      where: {
        id: removeRequest.id,
        contact_id: removeRequest.contact_id,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address not found");
    }

    const removedAddress = await prismaClient.address.delete({
      where: {
        id: removeRequest.id,
        contact_id: removeRequest.contact_id,
      },
    });

    return toAddressResponse(removedAddress);
  }

  static async list(
    user: User,
    contactId: number
  ): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExist(user.username, contactId);

    const addresses = await prismaClient.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
