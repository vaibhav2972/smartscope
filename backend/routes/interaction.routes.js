import express from "express";
import {
	trackInteraction,
	trackBulkInteractions,
	getUserInteractions,
	getInteractionStats,
	getItemAnalytics,
	getSearchAnalytics,
	getUserBehaviorFlow,
} from "../controllers/interaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/track", verifyJWT, trackInteraction);
router.post("/track/bulk", verifyJWT, trackBulkInteractions);
router.get("/user", verifyJWT, getUserInteractions);
router.get("/stats", verifyJWT, getInteractionStats);
router.get("/analytics/items", verifyJWT, getItemAnalytics);
router.get("/analytics/search", verifyJWT, getSearchAnalytics);
router.get("/flow", verifyJWT, getUserBehaviorFlow);
export default router;
