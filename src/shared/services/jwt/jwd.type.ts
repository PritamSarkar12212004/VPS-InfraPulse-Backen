export interface JwtGenerateType {
  userId: string;
}

export interface JwtVerifyType {
  token: string;
}

export interface JwtPayloadType {
  userId: string;
  tokenType: "access" | "refresh";
}