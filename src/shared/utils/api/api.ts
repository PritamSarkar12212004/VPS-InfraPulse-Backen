import axios from "axios";
import { OTP_SERVICE_URI } from "../../secrets/origin.secret.js";

export const api = axios.create({
  baseURL: OTP_SERVICE_URI,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
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
