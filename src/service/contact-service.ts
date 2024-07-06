import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";

import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      ...createRequest,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: record,
    });

    logger.debug("Contact:", contact);

    return toContactResponse(contact);
  }

  static async checkContactMustExist(username: string, contactId: number) {
    const contact = await prismaClient.contact.findUnique({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found");
    }
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contact = await prismaClient.contact.findUnique({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found");
    }

    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );

    logger.info("Validation :", updateRequest);

    await this.checkContactMustExist(user.username, updateRequest.id);

    const contact = await prismaClient.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: updateRequest,
    });

    return toContactResponse(contact);
  }

  static async delete(user: User, id: number): Promise<ContactResponse> {
    await this.checkContactMustExist(user.username, id);

    const contact = await prismaClient.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });
    return toContactResponse(contact);
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    // Validate search
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );

    // Count skip value
    const skip = (searchRequest.page - 1) * searchRequest.size;

    let filters = [];

    // filter name
    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }
    // filter phone
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }
    // filter email
    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    // filter all data with those 3 filter
    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const count = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    // return data

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(count / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
