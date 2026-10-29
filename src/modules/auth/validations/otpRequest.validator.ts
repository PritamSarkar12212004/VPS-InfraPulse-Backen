import { z } from "zod";
import { otpRequestField } from "../fields/otpRequest.field.js";

export const otpRequestSchema = z
  .object({
    [otpRequestField.phone]: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  })
  .strict();

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
