import { responseInter200, responseInter500 } from "./type.response.js";

export const response500 = ({ res }: responseInter500) => {
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
export const response200 = ({ res, message, data }: responseInter200) => {
  res.status(200).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
};

export const response404 = ({ res, message, data }: responseInter200) => {
  res.status(404).json({
    success: false,
    message,
    ...(data !== undefined ? { data } : {}),
  });
};
export const response401 = ({ res, message, data }: responseInter200) => {
  res.status(401).json({
    success: false,
    message,
    ...(data !== undefined ? { data } : {}),
  });
};
