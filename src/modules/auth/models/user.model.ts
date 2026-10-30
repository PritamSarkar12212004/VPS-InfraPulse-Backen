import mongoose from "mongoose";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { otpDbField } from "../fields/otpDbField.js";

const userSchema = new mongoose.Schema(
  {
    [otpRequestField.name]: {
      type: String,
      required: true,
      minlength: 2,
    },
    [otpRequestField.phone]: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"],
      trim: true,
    },
    [otpRequestField.refreshTokenHash]: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model(otpDbField.User, userSchema);
