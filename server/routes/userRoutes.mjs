import { Router } from "express";
import {
  getAllUsers,
  getPreferredVeggieCount,
  getSingleUser,
  getUserDistribution,
  sendOTP,
  updateUserPreferences,
} from "../controllers/UserControllers.mjs";
import { authenticate, authorize } from "../middlewares/authMiddleWares.mjs";

const router = Router();
const prefix = "/user";

router.get(`${prefix}/getAllUsers`, getAllUsers);
router.get(`${prefix}/getUserDetails/:id`, getSingleUser);
router.patch(`${prefix}/updatePreferences/:id`, updateUserPreferences);
router.get(`${prefix}/getUserDistribution`, getUserDistribution);
router.get(`${prefix}/getVeggieCount`, getPreferredVeggieCount);
router.post(`${prefix}/sendOTP`, sendOTP);
export default router;
