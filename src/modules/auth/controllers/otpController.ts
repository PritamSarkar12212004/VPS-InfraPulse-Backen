import { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { User } from "../models/user.model.js";

export const requestOtpController = async (req: Request, res: Response) => {
  const phone = req.body[otpRequestField.phone];
  const name = req.body[otpRequestField.name];
  const isExist = await User.find([otpRequestField.phone], phone);

  if (!isExist) {
    await User.create({
      [otpRequestField.name]: name,
      [otpRequestField.phone]: phone,
    });
  }
};
