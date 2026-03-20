import { Session } from "../models/session.model.js";
import { Interaction } from "../models/interaction.model.js";

export const startSession = async (req, res) => {
	try {
		const userId = req.user._id;
		const { websiteId, deviceInfo, ipAddress, location, referralSource } =
			req.body;

		// Check if there's an active session for this website
		const existingSession = await Session.findOne({
			userId,
			websiteId,
			isActive: true,
		});

		if (existingSession) {
			return res.status(200).json({
				success: true,
				message: "Active session already exists",
				data: existingSession,
			});
		}

		// Determine device type from user agent
		let deviceType = "desktop";
		if (deviceInfo?.userAgent) {
			if (/mobile/i.test(deviceInfo.userAgent)) deviceType = "mobile";
			else if (/tablet|ipad/i.test(deviceInfo.userAgent)) deviceType = "tablet";
		}

		const session = await Session.create({
			userId,
			websiteId,
			sessionStart: new Date(),
			deviceInfo: {
				...deviceInfo,
				deviceType,
			},
			ipAddress,
			location,
			referralSource: referralSource || "direct",
			isActive: true,
			totalInteractions: 0,
			totalClicks: 0,
			totalScrolls: 0,
			pagesVisited: 0,
			uniquePagesVisited: [],
			maxScrollDepth: 0,
			conversionEvents: [],
		});

		res.status(201).json({
			success: true,
			message: "Session started",
			data: session,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error starting session",
			error: error.message,
		});
	}
};

export const updateSessionMetrics = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const {
			pageUrl,
			scrollDepth,
			interactionType,
			conversionEvent,
			exitPage,
			exitIntent,
		} = req.body;

		const session = await Session.findById(sessionId);

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Session not found",
			});
		}

		// Update total interactions
		session.totalInteractions += 1;

		// Update interaction type counters
		if (interactionType === "click") {
			session.totalClicks += 1;
		} else if (interactionType === "scroll") {
			session.totalScrolls += 1;
		}

		// Update page visits
		if (pageUrl && !session.uniquePagesVisited.includes(pageUrl)) {
			session.uniquePagesVisited.push(pageUrl);
			session.pagesVisited += 1;
		}

		// Update max scroll depth
		if (scrollDepth && scrollDepth > session.maxScrollDepth) {
			session.maxScrollDepth = scrollDepth;
		}

		// Track conversion events
		if (
			conversionEvent &&
			!session.conversionEvents.includes(conversionEvent)
		) {
			session.conversionEvents.push(conversionEvent);
			session.hasConversion = true;
		}

		// Update exit behavior
		if (exitPage) session.exitPage = exitPage;
		if (exitIntent !== undefined) session.exitIntent = exitIntent;

		// Check for bounce (less than 30 seconds, only 1 page)
		const currentDuration = (new Date() - session.sessionStart) / 1000;
		if (currentDuration < 30 && session.pagesVisited <= 1) {
			session.bounceRate = true;
		}

		await session.save();

		res.status(200).json({
			success: true,
			message: "Session updated",
			data: session,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating session",
			error: error.message,
		});
	}
};

export const endSession = async (req, res) => {
	try {
		const { sessionId } = req.params;
		const { exitPage, exitIntent } = req.body;

		const session = await Session.findById(sessionId);

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Session not found",
			});
		}

		const sessionEnd = new Date();
		const duration = Math.floor((sessionEnd - session.sessionStart) / 1000);

		session.sessionEnd = sessionEnd;
		session.duration = duration;
		session.isActive = false;

		if (exitPage) session.exitPage = exitPage;
		if (exitIntent !== undefined) session.exitIntent = exitIntent;

		// Final bounce check
		if (duration < 30 && session.pagesVisited <= 1) {
			session.bounceRate = true;
		}

		await session.save();

		res.status(200).json({
			success: true,
			message: "Session ended",
			data: session,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error ending session",
			error: error.message,
		});
	}
};

export const getUserSessions = async (req, res) => {
	try {
		const userId = req.user._id;
		const { limit = 10, skip = 0, websiteId, startDate, endDate } = req.query;

		const query = { userId };
		if (websiteId) query.websiteId = websiteId;

		if (startDate || endDate) {
			query.sessionStart = {};
			if (startDate) query.sessionStart.$gte = new Date(startDate);
			if (endDate) query.sessionStart.$lte = new Date(endDate);
		}

		const sessions = await Session.find(query)
			.populate("websiteId")
			.sort({ sessionStart: -1 })
			.limit(parseInt(limit))
			.skip(parseInt(skip));

		const total = await Session.countDocuments(query);

		// Calculate aggregate stats
		const stats = await Session.aggregate([
			{ $match: query },
			{
				$group: {
					_id: null,
					avgDuration: { $avg: "$duration" },
					avgInteractions: { $avg: "$totalInteractions" },
					avgPagesVisited: { $avg: "$pagesVisited" },
					totalConversions: {
						$sum: { $cond: ["$hasConversion", 1, 0] },
					},
					bounceRate: {
						$avg: { $cond: ["$bounceRate", 1, 0] },
					},
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: sessions,
			stats: stats[0] || {},
			pagination: {
				total,
				limit: parseInt(limit),
				skip: parseInt(skip),
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching sessions",
			error: error.message,
		});
	}
};

export const getActiveSession = async (req, res) => {
	try {
		const userId = req.user._id;
		const { websiteId } = req.query;

		const query = { userId, isActive: true };
		if (websiteId) query.websiteId = websiteId;

		const session = await Session.findOne(query).populate("websiteId");

		res.status(200).json({
			success: true,
			data: session,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching active session",
			error: error.message,
		});
	}
};

export const getSessionAnalyticsByWebsite = async (req, res) => {
	try {
		const userId = req.user._id;
		const { startDate, endDate } = req.query;

		const matchQuery = { userId };
		if (startDate || endDate) {
			matchQuery.sessionStart = {};
			if (startDate) matchQuery.sessionStart.$gte = new Date(startDate);
			if (endDate) matchQuery.sessionStart.$lte = new Date(endDate);
		}

		const analytics = await Session.aggregate([
			{ $match: matchQuery },
			{
				$group: {
					_id: "$websiteId",
					totalSessions: { $sum: 1 },
					avgDuration: { $avg: "$duration" },
					avgInteractions: { $avg: "$totalInteractions" },
					avgPagesVisited: { $avg: "$pagesVisited" },
					totalConversions: {
						$sum: { $cond: ["$hasConversion", 1, 0] },
					},
					bounceRate: {
						$avg: { $cond: ["$bounceRate", 1, 0] },
					},
					avgScrollDepth: { $avg: "$maxScrollDepth" },
				},
			},
			{
				$lookup: {
					from: "websites",
					localField: "_id",
					foreignField: "_id",
					as: "website",
				},
			},
			{ $unwind: "$website" },
			{
				$project: {
					websiteId: "$_id",
					websiteName: "$website.name",
					websiteType: "$website.type",
					totalSessions: 1,
					avgDuration: { $round: ["$avgDuration", 2] },
					avgInteractions: { $round: ["$avgInteractions", 2] },
					avgPagesVisited: { $round: ["$avgPagesVisited", 2] },
					totalConversions: 1,
					conversionRate: {
						$round: [
							{
								$multiply: [
									{
										$divide: ["$totalConversions", "$totalSessions"],
									},
									100,
								],
							},
							2,
						],
					},
					bounceRate: {
						$round: [{ $multiply: ["$bounceRate", 100] }, 2],
					},
					avgScrollDepth: { $round: ["$avgScrollDepth", 2] },
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: analytics,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching session analytics",
			error: error.message,
		});
	}
};

export const getSessionDetails = async (req, res) => {
	try {
		const { sessionId } = req.params;

		const session = await Session.findById(sessionId).populate("websiteId");

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Session not found",
			});
		}

		// Get all interactions for this session
		const interactions = await Interaction.find({ sessionId }).sort({
			timestamp: 1,
		});

		res.status(200).json({
			success: true,
			data: {
				session,
				interactions,
				summary: {
					totalInteractions: interactions.length,
					interactionTypes: [
						...new Set(interactions.map((i) => i.interactionType)),
					],
					duration: session.duration,
					pagesVisited: session.pagesVisited,
				},
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching session details",
			error: error.message,
		});
	}
};
