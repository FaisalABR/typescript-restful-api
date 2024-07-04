import { ZodType } from "zod";
import { CreateRequestUser } from "../model/user-model";

export class Validation {
  static validate<T>(schema: ZodType, data: T): T {
    return schema.parse(data);
  }
}
