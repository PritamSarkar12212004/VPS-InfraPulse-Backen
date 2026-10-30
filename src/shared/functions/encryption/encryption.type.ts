export interface encryptionOtpType {
  value: string;
}

export interface verifyencryptionOtpType extends encryptionOtpType {
  hashedOtp: string;
}
