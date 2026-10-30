import axios from "axios";
import type { AxiosError } from "axios";
import {
  OTP_SERVICE_URI,
  OTP_API_TIMEOUT,
  TEMPLATE_OTP_ID,
  OTP_TOKEN,
} from "../../../shared/secrets/otp.secret.js";
import { logger } from "../../../shared/config/logging.config.js";
import { authPath } from "../../../modules/auth/auth.path.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const wpi = axios.create({
  baseURL: OTP_SERVICE_URI,
  timeout: OTP_API_TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export interface WhatsAppSendResult {
  success: boolean;
  statusCode?: number;
  response?: string;
  message?: string;
}

const maskPhone = (phone: string): string => phone.replace(/\d(?=\d{4})/g, "*");

export const sendWhatsAppOtp = async (
  to: string,
  otpCode: string,
  mediaUrl?: string,
): Promise<WhatsAppSendResult> => {
  if (!OTP_TOKEN) {
    throw new Error("WhatsApp OTP token is not configured (set OTP_TOKEN)");
  }

  if (!TEMPLATE_OTP_ID) {
    throw new Error(
      "WhatsApp OTP template ID is not configured (set TEMPLATE_OTP_ID)",
    );
  }

  const payload = {
    to,
    template: TEMPLATE_OTP_ID,
    variables: {
      otp_code: otpCode,
    },
    ...(mediaUrl ? { media: { url: mediaUrl } } : {}),
  };

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await wpi.post(authPath.externalRequestOtp, payload, {
        headers: {
          Authorization: `Bearer ${OTP_TOKEN}`,
        },
      });
      logger.info(
        { statusCode: response.status, to: maskPhone(to), attempt },
        "WhatsApp OTP sent successfully",
      );

      return {
        success: true,
        statusCode: response.status,
        response: JSON.stringify(response.data),
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        logger.warn(
          {
            statusCode: axiosError.response.status,
            to: maskPhone(to),
            body: axiosError.response.data,
          },
          "WhatsApp gateway rejected OTP",
        );

        return {
          success: false,
          statusCode: axiosError.response.status,
          response: JSON.stringify(axiosError.response.data),
          message: String(axiosError.response.data),
        };
      }

      lastError = error;
      logger.warn(
        {
          attempt,
          maxAttempts: MAX_RETRIES,
          to: maskPhone(to),
          reason: axiosError.message,
        },
        "WhatsApp attempt failed",
      );

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Could not reach WhatsApp gateway after ${MAX_RETRIES} attempts: ${lastError}`,
  );
};
