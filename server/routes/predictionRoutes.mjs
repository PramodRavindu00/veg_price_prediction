import { Router } from "express";
import { predictions } from "../controllers/PredictionControllers.mjs";

const router = Router();
const prefix = "/prediction"

router.post(`${prefix}/getPredictions`, predictions);

export default router;