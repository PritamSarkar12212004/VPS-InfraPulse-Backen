import { createHmac, timingSafeEqual } from "node:crypto";
import { OTP_HASH_SECRET } from "../../secrets/encryption.js";
import {
  encryptionOtpType,
  verifyencryptionOtpType,
} from "./encryption.type.js";

export const has = async ({ value }: encryptionOtpType): Promise<string> => {
  return createHmac("sha256", OTP_HASH_SECRET)
    .update(String(value))
    .digest("hex");
};

export const hasverify = async ({
  value,
  hashedOtp,
}: verifyencryptionOtpType): Promise<boolean> => {
  const inputHash = await has({ value });

  if (!/^[a-f0-9]{64}$/i.test(hashedOtp)) {
    return false;
  }

  const inputBuffer = Buffer.from(inputHash, "hex");
  const storedBuffer = Buffer.from(hashedOtp, "hex");

  return timingSafeEqual(inputBuffer, storedBuffer);
};
