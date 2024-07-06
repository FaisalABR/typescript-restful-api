import { z, ZodType } from "zod";

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(100),
    province: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().positive(),
  });

  static readonly GET: ZodType = z.object({
    id: z.number().positive(),
    contact_id: z.number().positive(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.number().positive(),
    contact_id: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(100),
    province: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().positive(),
  });
}
