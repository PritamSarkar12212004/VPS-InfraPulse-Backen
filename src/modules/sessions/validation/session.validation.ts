import z from "zod";

export const sessionValidation = z
  .object({
    accessToken: z.string().trim(),
  })
  .strict();

export type sessionSchema = z.infer<typeof sessionValidation>;
