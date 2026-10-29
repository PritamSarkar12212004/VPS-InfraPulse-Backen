import { Response } from "express";

export interface responseInter500 {
  res: Response;
}

export interface responseInter200 extends responseInter500 {
  message: string;
  data?: any;
}
