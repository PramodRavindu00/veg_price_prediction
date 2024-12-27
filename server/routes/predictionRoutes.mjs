import { Router } from "express";
import { multipleVegPredictions, predictions } from "../controllers/PredictionControllers.mjs";

const router = Router();
const prefix = "/prediction"

router.post(`${prefix}/getPredictions`, predictions);
router.post(`${prefix}/multiVegPredictions`, multipleVegPredictions);

export default router;