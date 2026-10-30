export interface OtpTemplateBodyParams {
  to: string;
  otp_code: string;
  uri: string;
}
export interface RedisFunctionInter {
  phone: string;
  otphash: string;
}
export interface RedisFunctionVerify {
  phone: string;
}
export interface OtpVerifyInter extends RedisFunctionVerify {
  otp: string;
}

export interface AuthRedisResponse {
  status: boolean;
  message: string[];
  data: {
    remainingTime: number;
  } | null;
}
