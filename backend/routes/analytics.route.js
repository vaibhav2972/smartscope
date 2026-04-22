import express from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const router = express.Router();



router.get(
	"/overview",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:overview", 300),
	analyticsController.getAnalyticsOverview,
);

router.get(
	"/ml-health",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "ml:health", 60),
	analyticsController.checkMLServiceHealth,
);



router.get(
	"/user/:userId/intelligence",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(
		(req) => `user:${req.params.userId}:intelligence`,
		900, 
	),
	analyticsController.getUserIntelligence,
);

router.get(
	"/user/:userId/summary",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:summary`, 120),
	analyticsController.getUserBehaviorSummary,
);



router.get(
	"/segments",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:segments", 600),
	analyticsController.getUserSegments,
);

router.get(
	"/user/:userId/segment",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:segment`, 600),
	analyticsController.getUserSegment,
);



router.get(
	"/engagement/leaderboard",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "engagement:leaderboard", 300),
	analyticsController.getEngagementLeaderboard,
);

router.get(
	"/user/:userId/engagement",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:engagement`, 180),
	analyticsController.getUserEngagementScore,
);



router.get(
	"/user/:userId/recommendations",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(
		(req) =>
			`user:${req.params.userId}:rec:${req.query.entityType || "product"}`,
		600,
	),
	analyticsController.getRecommendations,
);

router.get(
	"/user/:userId/similar-users",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(
		(req) =>
			`user:${req.params.userId}:similar:${req.query.entityType || "product"}`,
		600,
	),
	analyticsController.getSimilarUsers,
);



router.get(
	"/churn-risk",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:churn", 600),
	analyticsController.getChurnRisk,
);



router.get(
	"/rfm",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:rfm", 900),
	analyticsController.getRFMAnalysis,
);

router.get(
	"/user/:userId/rfm",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:rfm`, 600),
	analyticsController.getUserRFMSegment,
);



router.get(
	"/behavior-importance/:userId",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:importance`, 60),
	analyticsController.getBehaviorImportance,
);

router.get(
	"/feature-attribution/:userId",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware((req) => `user:${req.params.userId}:feature`, 60),
	analyticsController.getFeatureAttribution,
);



router.get(
	"/website-intelligence",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:websites", 900),
	analyticsController.getWebsiteIntelligence,
);



router.get(
	"/lifecycle",
	verifyJWT,
	adminMiddleware,
	cacheMiddleware(() => "analytics:lifecycle", 600),
	analyticsController.getUserLifecycle,
);

export default router;
