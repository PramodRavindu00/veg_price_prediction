import { Router } from "express";
import { getAllUsers, getSingleUser } from "../controllers/UserControllers.mjs";

const router = Router();
const prefix = "/user";

router.get(`${prefix}/getAllUsers`, getAllUsers);
router.get(`${prefix}/getUserDetails/:id`, getSingleUser);

export default router;
