import express from "express";
import {
	startSession,
	endSession,
	updateSessionMetrics,
	getUserSessions,
	getActiveSession,
	getSessionAnalyticsByWebsite,
	getSessionDetails,
} from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start", verifyJWT, startSession);
router.patch("/end/:sessionId", verifyJWT, endSession);
router.patch("/update/:sessionId", verifyJWT, updateSessionMetrics);
router.get("/user", verifyJWT, getUserSessions);
router.get("/active", verifyJWT, getActiveSession);
router.get("/analytics/website", verifyJWT, getSessionAnalyticsByWebsite);
router.get("/details/:sessionId", verifyJWT, getSessionDetails);
export default router;
