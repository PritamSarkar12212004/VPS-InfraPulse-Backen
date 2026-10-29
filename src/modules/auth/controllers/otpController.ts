import { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";

export const requestOtpController = async (req: Request, res: Response) => {
  const phone = req.body[otpRequestField.phone];
  
};
