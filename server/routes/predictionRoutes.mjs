import { Router } from "express";
import { predictions, preferredPredictions } from "../controllers/PredictionControllers.mjs";

const router = Router();
const prefix = "/prediction"

router.post(`${prefix}/getPredictions`, predictions);
router.post(`${prefix}/preferredPredictions`, preferredPredictions);

export default router;