import { z } from "zod";

export const otpRequestSchema = z
  .object({
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  })
  .strict();
