import { Router } from "express";
import { login, logout, registerUser, validateToken } from "../controllers/AuthControllers.mjs";

const router = Router();
const prefix = "/auth";

router.post(`${prefix}/userRegister`, registerUser);
router.post(`${prefix}/userLogin`, login);
router.post(`${prefix}/logOut`, logout);
router.get(`${prefix}/validateToken`, validateToken);

export default router;
