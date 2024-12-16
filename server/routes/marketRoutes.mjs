import { Router } from "express";
import { getAllMarkets } from "../controllers/MarketController.mjs";

const router = Router();
const prefix = "/market";

router.get(`${prefix}/getAllMarkets`, getAllMarkets);

export default router;
