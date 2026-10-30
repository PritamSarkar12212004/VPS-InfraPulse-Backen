import express from "express";
import { cpuRequestField } from "./fields/cpuRequest.field.js";
import { cpuInfoController } from "./controllers/cpuInfo.controller.js";

const route = express.Router();

route.get([cpuRequestField.cpuInfo], cpuInfoController);

export { route as CpuRoute };
