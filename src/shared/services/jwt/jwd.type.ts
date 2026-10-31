export interface JwtGenerateType {
  userId: string;
  sessionId: string;
}

export interface JwtVerifyType {
  token: string;
}

export interface JwtPayloadType {
  userId: string;
  tokenType: "access" | "refresh";
}
