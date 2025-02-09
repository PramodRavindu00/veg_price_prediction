import { Router } from "express";
import { getCounts, getFuelPrice, getWeatherData, updateFuelPrice } from "../controllers/MaintenanceController.mjs";

const router = Router();
const prefix = "/maintenance";

router.post(`${prefix}/updateFuelPrice`, updateFuelPrice);
router.get(`${prefix}/getFuelPrice`, getFuelPrice);
router.get(`${prefix}/getCounts`, getCounts);
router.get(`${prefix}/getWeatherData/:location`,getWeatherData)
export default router;