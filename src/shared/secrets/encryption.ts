const secret = process.env.OTP_HASH_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("OTP_HASH_SECRET is missing or too short");
}

export const OTP_HASH_SECRET: string = secret;
