const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRY;
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRY;

if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET.length < 32) {
  throw new Error("JWT_ACCESS_SECRET is missing or too short");
}

if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length < 32) {
  throw new Error("JWT_REFRESH_SECRET is missing or too short");
}

if (!JWT_ACCESS_EXPIRE) {
  throw new Error("JWT_ACCESS_EXPIRY is missing");
}

if (!JWT_REFRESH_EXPIRE) {
  throw new Error("JWT_REFRESH_EXPIRY is missing");
}

export {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRE,
  JWT_REFRESH_EXPIRE,
};
