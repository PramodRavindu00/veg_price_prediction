import { Router } from "express";
import { getAllVegetables } from "../controllers/vegetableControllers.mjs";

const router = Router();
const prefix = "/vegetables"

router.get(`${prefix}/allVegetables`, getAllVegetables);

export default router;