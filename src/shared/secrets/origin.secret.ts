export const FrontendOriginDevelopment =
  process.env.Frontend_ORIGIN_DEV || "http://localhost:3000";
export const FrontendOriginProduction =
  process.env.Frontend_ORIGIN_PRO || "https://infrapulse.com";
export const requestMethod = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
];
export const Headers = ["Content-Type", "Authorization", "X-Request-ID"];
export const exposedHeaders = ["X-Request-ID"];
export const credentials = true;
export const maxAge = 86400;
export const optionsSuccessStatus = 204;
