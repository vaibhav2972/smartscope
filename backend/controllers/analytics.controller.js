import mlService from "../utils/mlServiceClient.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { Interaction } from "../models/interaction.model.js";
import { formatUserDataForBehaviorML } from "../utils/dataFormatter.js";
import { Website } from "../models/website.model.js";
import axios from "axios";

export const getAnalyticsOverview = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalSessions = await Session.countDocuments();
		const totalInteractions = await Interaction.countDocuments();

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const activeUserSessions = await Session.distinct("userId", {
			sessionStart: { $gte: sevenDaysAgo },
		});
		const activeUsers = activeUserSessions.length;

		const avgDurationResult = await Session.aggregate([
			{
				$group: {
					_id: null,
					avgDuration: { $avg: "$duration" },
				},
			},
		]);
		const avgDuration = avgDurationResult[0]?.avgDuration || 0;

		const conversionsCount = await Session.countDocuments({
			hasConversion: true,
		});
		const conversionRate =
			totalSessions > 0
				? ((conversionsCount / totalSessions) * 100).toFixed(2)
				: 0;

		const bouncedSessions = await Session.countDocuments({ bounceRate: true });
		const bounceRate =
			totalSessions > 0
				? ((bouncedSessions / totalSessions) * 100).toFixed(2)
				: 0;

		res.json({
			success: true,
			overview: {
				totalUsers,
				totalSessions,
				totalInteractions,
				activeUsers,
				avgSessionDuration: Math.round(avgDuration),
				conversionRate: parseFloat(conversionRate),
				bounceRate: parseFloat(bounceRate),
			},
		});
	} catch (error) {
		console.error("Error in getAnalyticsOverview:", error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch analytics overview",
			message: error.message,
		});
	}
};


export const getUserSegments = async (req, res) => {
	try {
		const result = await mlService.segmentUsers();
		res.json(result);
	} catch (error) {
		console.error("Error in getUserSegments:", error);
		res.status(500).json(error);
	}
};

export const getUserSegment = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await mlService.getUserSegment(userId);
		res.json(result);
	} catch (error) {
		console.error("Error in getUserSegment:", error);
		res.status(500).json(error);
	}
};

export const getEngagementLeaderboard = async (req, res) => {
	try {
		const result = await mlService.calculateEngagementScores();
		res.json(result);
	} catch (error) {
		console.error("Error in getEngagementLeaderboard:", error);
		res.status(500).json(error);
	}
};


export const getUserEngagementScore = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await mlService.getUserEngagementScore(userId);
		res.json(result);
	} catch (error) {
		console.error("Error in getUserEngagementScore:", error);
		res.status(500).json(error);
	}
};


export const getRecommendations = async (req, res) => {
	try {
		const { userId } = req.params;
		const { entityType = "product", topN = 5 } = req.query;

		const result = await mlService.getRecommendations(
			userId,
			entityType,
			parseInt(topN),
		);

		res.json(result);
	} catch (error) {
		console.error("Error in getRecommendations:", error);
		res.status(500).json(error);
	}
};


export const getSimilarUsers = async (req, res) => {
	try {
		const { userId } = req.params;
		const { topN = 5, entityType = "product" } = req.query;

		const result = await mlService.getSimilarUsers(
			userId,
			parseInt(topN),
			entityType,
		);

		res.json(result);
	} catch (error) {
		console.error("Error in getSimilarUsers:", error);
		res.status(500).json(error);
	}
};


export const getChurnRisk = async (req, res) => {
	try {
		const result = await mlService.predictChurnRisk();
		res.json(result);
	} catch (error) {
		console.error("Error in getChurnRisk:", error);
		res.status(500).json(error);
	}
};

export const getRFMAnalysis = async (req, res) => {
	try {
		const result = await mlService.performRFMAnalysis();
		res.json(result);
	} catch (error) {
		console.error("Error in getRFMAnalysis:", error);
		res.status(500).json(error);
	}
};


export const getUserRFMSegment = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await mlService.getUserRFMSegment(userId);
		res.json(result);
	} catch (error) {
		console.error("Error in getUserRFMSegment:", error);
		res.status(500).json(error);
	}
};


export const getUserLifecycle = async (req, res) => {
	try {
		const result = await mlService.analyzeUserLifecycle();
		res.json(result);
	} catch (error) {
		console.error("Error in getUserLifecycle:", error);
		res.status(500).json(error);
	}
};


export const getUserIntelligence = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const result = await mlService.getUserIntelligence(userId);
		res.json(result);
	} catch (error) {
		console.error("Error in getUserIntelligence:", error);
		res.status(500).json(error);
	}
};


export const getUserBehaviorSummary = async (req, res) => {
	try {
		const { userId } = req.params;

		const sessions = await Session.find({ userId }).sort({ sessionStart: -1 });
		const interactions = await Interaction.find({ userId }).sort({
			timestamp: -1,
		});

		const totalSessions = sessions.length;
		const totalInteractions = interactions.length;
		const avgDuration =
			sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions || 0;

		const bounceCount = sessions.filter((s) => s.bounceRate).length;
		const bounceRate =
			totalSessions > 0 ? ((bounceCount / totalSessions) * 100).toFixed(2) : 0;

		const lastSession = sessions[0];

		const entityCounts = {};
		interactions.forEach((int) => {
			const entityName = int.entityData?.entityName || "Unknown";
			entityCounts[entityName] = (entityCounts[entityName] || 0) + 1;
		});

		const topEntities = Object.entries(entityCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, count]) => ({ name, count }));

		res.json({
			success: true,
			userId,
			summary: {
				totalSessions,
				totalInteractions,
				avgDuration: Math.round(avgDuration),
				bounceRate: parseFloat(bounceRate),
				lastActive: lastSession?.sessionEnd,
				topInteractions: topEntities,
			},
			recentSessions: sessions.slice(0, 5),
			recentInteractions: interactions.slice(0, 10),
		});
	} catch (error) {
		console.error("Error in getUserBehaviorSummary:", error);
		res.status(500).json({
			success: false,
			error: "Failed to fetch user behavior summary",
			message: error.message,
		});
	}
};


export const checkMLServiceHealth = async (req, res) => {
	try {
		const health = await mlService.healthCheck();
		res.json(health);
	} catch (error) {
		res.status(500).json({
			success: false,
			status: "error",
			message: "Failed to check ML service health",
		});
	}
};

export const getBehaviorImportance = async (req, res) => {
	try {
		const { userId } = req.params;

	
		const sessions = await Session.find({ userId });

		if (!sessions.length) {
			return res.status(404).json({
				success: false,
				message: "No session data found",
			});
		}

		const userData = formatUserDataForBehaviorML(sessions);

		
		const allSessions = await Session.find();

		const allUsersMap = {};

		allSessions.forEach((s) => {
			const uid = s.userId.toString();

			if (!allUsersMap[uid]) {
				allUsersMap[uid] = [];
			}

			allUsersMap[uid].push(s);
		});

		const allUsersData = Object.values(allUsersMap).map((sessions) =>
			formatUserDataForBehaviorML(sessions),
		);

	
		const response = await axios.post(
			`${process.env.ML_SERVICE_URL}/behavior-importance`,
			{
				user_id: userId,
				user_data: userData,
				all_users_data: allUsersData,
			},
		);

		res.json(response.data);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Behavior importance failed",
			error: error.message,
		});
	}
};

export const getFeatureAttribution = async (req, res) => {
	try {
		const { userId } = req.params;

		const interactions = await Interaction.find({ userId }).lean();
		const sessions = await Session.find({ userId }).lean();

		const response = await axios.post(
			`${process.env.ML_SERVICE_URL}/feature-attribution`,
			{
				feature_interactions: interactions,
				user_sessions: sessions,
			},
		);

		res.json(response.data);
	} catch (error) {
		console.error(
			"Feature Attribution Error:",
			error?.response?.data || error.message,
		);

		res.status(500).json({
			success: false,
			error: error?.response?.data || error.message,
		});
	}
};

export const getWebsiteIntelligence = async (req, res) => {
	try {
		const websites = await Website.find();

		const websiteData = await Promise.all(
			websites.map(async (site) => {
				const sessions = await Session.find({ websiteId: site._id });
				const interactions = await Interaction.find({ websiteId: site._id });

				return {
					website_id: site._id,
					website_name: site.name,
					sessions,
					interactions,
				};
			}),
		);

		const response = await axios.post(
			`${process.env.ML_SERVICE_URL}/website-intelligence`,
			{
				websites_data: websiteData,
			},
		);

		res.json(response.data);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};