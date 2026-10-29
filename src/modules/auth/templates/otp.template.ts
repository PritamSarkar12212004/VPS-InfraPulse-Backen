import { TEMPLATE_OTP_ID } from "../../../shared/secrets/otp.secret.js";
import { OtpTemplateBodyParams } from "../auth.types.js";

export const otpTemplateBody = ({
  to,
  otp_code,
  uri,
}: OtpTemplateBodyParams) => {
  return {
    to,
    template: TEMPLATE_OTP_ID,
    variables: {
      otp_code,
    },
    media: {
      url: uri,
    },
  };
};
