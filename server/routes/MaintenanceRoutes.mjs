import { Router } from "express";
import { getFuelPrice, updateFuelPrice } from "../controllers/MaintenanceController.mjs";

const router = Router();
const prefix = "/maintenance";

router.post(`${prefix}/updateFuelPrice`, updateFuelPrice);
router.get(`${prefix}/getFuelPrice`, getFuelPrice);

export default router;