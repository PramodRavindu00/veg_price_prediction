import { Router } from "express";
import { submitQuery, viewQueries } from "../controllers/QueryControllers.mjs";
import { authenticate, authorize } from "../middlewares/authMiddleWares.mjs";

const router = Router();
const prefix = "/query";

router.post(`${prefix}/submitQuery`, submitQuery);
router.get(`${prefix}/viewQueries`, viewQueries);

export default router;
