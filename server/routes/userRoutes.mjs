import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUserPreferences,
} from "../controllers/UserControllers.mjs";
import { authenticate, authorize } from "../middlewares/authMiddleWares.mjs";

const router = Router();
const prefix = "/user";

router.get(`${prefix}/getAllUsers`, getAllUsers);
router.get(`${prefix}/getUserDetails/:id`, getSingleUser);
router.patch(`${prefix}/updatePreferences/:id`, updateUserPreferences);

export default router;
