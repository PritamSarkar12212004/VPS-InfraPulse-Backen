import axios from "axios";
import { OTP_API_TIMEOUT, OTP_SERVICE_URI } from "../../secrets/otp.secret.js";

export const wpi = axios.create({
  baseURL: OTP_SERVICE_URI,
  timeout: OTP_API_TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

wpi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error("Network error: No response received");
      } else if (error.response) {
        console.error("API Error:", error.response.status);
      } else if (error.request) {
        console.error("Network error: No response received");
      } else {
        console.error("Request setup error:", error.message);
      }
    }

    return Promise.reject(error);
  },
);
