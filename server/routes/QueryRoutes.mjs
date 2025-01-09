import { Router } from "express";
import {
  replyToQuery,
  submitQuery,
  viewQueries,
} from "../controllers/QueryControllers.mjs";
import { authenticate, authorize } from "../middlewares/authMiddleWares.mjs";

const router = Router();
const prefix = "/query";

router.post(`${prefix}/submitQuery`, submitQuery);
router.get(`${prefix}/viewQueries`, viewQueries);
router.patch(`${prefix}/replyToQuery/:id`, replyToQuery);

export default router;
