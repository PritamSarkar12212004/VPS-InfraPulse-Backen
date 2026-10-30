import { z } from "zod";
import { otpRequestField } from "../fields/otpRequest.field.js";

export const otpRequestSchema = z
  .object({
    [otpRequestField.phone]: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    [otpRequestField.name]: z
      .string()
      .min(2, "Name must be at least 2 characters"),
  })
  .strict();

export const otpVerifySchema = z.object({
  [otpRequestField.otp]: z.string().min(6).max(6).trim(),
  [otpRequestField.phone]: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
});

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type otpVerifySchema = z.infer<typeof otpVerifySchema>;
