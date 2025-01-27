import { Router } from "express";
import {
  changePassword,
  getAllUsers,
  getPreferredVeggieCount,
  getSingleUser,
  getUserDistribution,
  sendOTP,
  updateUserPreferences,
  verifyOTP,
} from "../controllers/UserControllers.mjs";

const router = Router();
const prefix = "/user";

router.get(`${prefix}/getAllUsers`, getAllUsers);
router.get(`${prefix}/getUserDetails/:id`, getSingleUser);
router.patch(`${prefix}/updatePreferences/:id`, updateUserPreferences);
router.get(`${prefix}/getUserDistribution`, getUserDistribution);
router.get(`${prefix}/getVeggieCount`, getPreferredVeggieCount);
router.post(`${prefix}/sendOTP`, sendOTP);
router.post(`${prefix}/verifyOTP`, verifyOTP);
router.patch(`${prefix}/changePassword/:id`, changePassword);

export default router;
