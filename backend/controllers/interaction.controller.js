import mongoose from "mongoose";
import { Interaction } from "../models/interaction.model.js";
import { Session } from "../models/session.model.js";

export const trackInteraction = async (req, res) => {
	try {
		const userId = req.user._id;
		const {
			sessionId,
			websiteId,
			interactionType,
			actionCategory,
			elementId,
			elementType,
			elementText,
			pageUrl,
			pageName,
			scrollDepth,
			coordinates,
			timeOnElement,
			entityData,
			searchQuery,
			searchResultsCount,
			formData,
			previousInteraction,
			viewportSize,
			referrer,
			metadata,
		} = req.body;

		if (
			!sessionId ||
			!websiteId ||
			!interactionType ||
			!pageUrl ||
			!actionCategory
		) {
			return res.status(400).json({
				success: false,
				message:
					"Missing required fields: sessionId, websiteId, interactionType, pageUrl, actionCategory",
			});
		}

		const session = await Session.findOne({
			_id: sessionId,
			userId,
			isActive: true,
		});

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Active session not found",
			});
		}

		const interaction = await Interaction.create({
			userId,
			sessionId,
			websiteId,
			interactionType,
			actionCategory,
			elementId,
			elementType,
			elementText,
			pageUrl,
			pageName,
			scrollDepth,
			coordinates,
			timeOnElement,
			entityData,
			searchQuery,
			searchResultsCount,
			formData,
			previousInteraction,
			viewportSize,
			referrer,
			metadata,
			timestamp: new Date(),
		});

		
		await updateSessionFromInteraction(sessionId, {
			pageUrl,
			scrollDepth,
			interactionType,
			conversionEvent: getConversionEvent(interactionType),
		});

		res.status(201).json({
			success: true,
			message: "Interaction tracked",
			data: interaction,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error tracking interaction",
			error: error.message,
		});
	}
};


const updateSessionFromInteraction = async (
	sessionId,
	{ pageUrl, scrollDepth, interactionType, conversionEvent },
) => {
	try {
		if (!sessionId) return;

		const update = {
			$inc: {
				totalInteractions: 1,
				totalClicks: interactionType === "click" ? 1 : 0,
				totalScrolls: interactionType === "scroll" ? 1 : 0,
			},
		};

		if (scrollDepth) {
			update.$max = { maxScrollDepth: scrollDepth };
		}

		if (pageUrl) {
			update.$addToSet = { uniquePagesVisited: pageUrl };
		}

		if (conversionEvent) {
			update.$addToSet = {
				...(update.$addToSet || {}),
				conversionEvents: conversionEvent,
			};
			update.$set = { hasConversion: true };
		}

		await Session.updateOne({ _id: sessionId, isActive: true }, update);
	} catch (error) {
		console.error("Error updating session from interaction:", error);
	}
};


const getConversionEvent = (interactionType) => {
	const conversionMap = {
		add_to_cart: "add_to_cart",
		checkout_complete: "purchase",
		form_submit: "lead",
		download: "download",
		rating_submit: "engagement",
	};
	return conversionMap[interactionType] || null;
};


export const trackBulkInteractions = async (req, res) => {
	try {
		const userId = req.user._id;
		const { interactions } = req.body;

		if (!Array.isArray(interactions) || interactions.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid interactions data",
			});
		}

		const interactionsWithUser = interactions.map((int) => ({
			...int,
			userId,
			timestamp: new Date(int.timestamp || Date.now()),
		}));

		const result = await Interaction.insertMany(interactionsWithUser);

		
		const sessionUpdates = {};
		for (const interaction of interactions) {
			if (!sessionUpdates[interaction.sessionId]) {
				sessionUpdates[interaction.sessionId] = {
					pageUrls: new Set(),
					maxScroll: 0,
					clicks: 0,
					scrolls: 0,
					conversions: new Set(),
				};
			}

			const update = sessionUpdates[interaction.sessionId];
			if (interaction.pageUrl) update.pageUrls.add(interaction.pageUrl);
			if (interaction.scrollDepth > update.maxScroll)
				update.maxScroll = interaction.scrollDepth;
			if (interaction.interactionType === "click") update.clicks++;
			if (interaction.interactionType === "scroll") update.scrolls++;

			const conv = getConversionEvent(interaction.interactionType);
			if (conv) update.conversions.add(conv);
		}

		
		for (const [sessionId, updates] of Object.entries(sessionUpdates)) {
			const session = await Session.findById(sessionId);
			if (session) {
				session.totalInteractions += interactions.filter(
					(i) => i.sessionId === sessionId,
				).length;
				session.totalClicks += updates.clicks;
				session.totalScrolls += updates.scrolls;

				updates.pageUrls.forEach((url) => {
					if (!session.uniquePagesVisited.includes(url)) {
						session.uniquePagesVisited.push(url);
						session.pagesVisited += 1;
					}
				});

				if (updates.maxScroll > session.maxScrollDepth) {
					session.maxScrollDepth = updates.maxScroll;
				}

				updates.conversions.forEach((conv) => {
					if (!session.conversionEvents.includes(conv)) {
						session.conversionEvents.push(conv);
						session.hasConversion = true;
					}
				});

				await session.save();
			}
		}

		res.status(201).json({
			success: true,
			message: `${result.length} interactions tracked`,
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error tracking bulk interactions",
			error: error.message,
		});
	}
};


export const getUserInteractions = async (req, res) => {
	try {
		const userId = req.user._id;
		const {
			websiteId,
			sessionId,
			interactionType,
			limit = 50,
			skip = 0,
			startDate,
			endDate,
		} = req.query;

		const query = { userId };

		if (websiteId) query.websiteId = websiteId;
		if (sessionId) query.sessionId = sessionId;
		if (interactionType) query.interactionType = interactionType;

		if (startDate || endDate) {
			query.timestamp = {};
			if (startDate) query.timestamp.$gte = new Date(startDate);
			if (endDate) query.timestamp.$lte = new Date(endDate);
		}

		const interactions = await Interaction.find(query)
			.populate("websiteId")
			.populate("sessionId")
			.sort({ timestamp: -1 })
			.limit(parseInt(limit))
			.skip(parseInt(skip));

		const total = await Interaction.countDocuments(query);

		res.status(200).json({
			success: true,
			data: interactions,
			pagination: {
				total,
				limit: parseInt(limit),
				skip: parseInt(skip),
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching interactions",
			error: error.message,
		});
	}
};


export const getInteractionStats = async (req, res) => {
	try {
		const userId = req.user._id;
		const { websiteId, startDate, endDate } = req.query;

		const matchQuery = { userId };
		if (websiteId) matchQuery.websiteId = new mongoose.Types.ObjectId(websiteId);

		if (startDate || endDate) {
			matchQuery.timestamp = {};
			if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
			if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
		}

		
		const byType = await Interaction.aggregate([
			{ $match: matchQuery },
			{
				$group: {
					_id: "$interactionType",
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		]);

		
		const timeline = await Interaction.aggregate([
			{ $match: matchQuery },
			{
				$group: {
					_id: {
						hour: { $hour: "$timestamp" },
						date: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$timestamp",
							},
						},
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { "_id.date": 1, "_id.hour": 1 } },
		]);

		
		const topPages = await Interaction.aggregate([
			{ $match: matchQuery },
			{
				$group: {
					_id: "$pageUrl",
					interactions: { $sum: 1 },
					uniqueUsers: { $addToSet: "$userId" },
				},
			},
			{
				$project: {
					pageUrl: "$_id",
					interactions: 1,
					uniqueUsers: { $size: "$uniqueUsers" },
				},
			},
			{ $sort: { interactions: -1 } },
			{ $limit: 10 },
		]);

		const totalInteractions = await Interaction.countDocuments(matchQuery);

		res.status(200).json({
			success: true,
			data: {
				total: totalInteractions,
				byType,
				timeline,
				topPages,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching interaction stats",
			error: error.message,
		});
	}
};


export const getItemAnalytics = async (req, res) => {
	try {
		const userId = req.user._id;
		const { websiteId, startDate, endDate } = req.query;

		const matchQuery = {
			userId,
			"entityData.entityId": { $exists: true, $ne: null },
		};

		if (websiteId)
			matchQuery.websiteId = new mongoose.Types.ObjectId(websiteId);

		
		
		
		

		if (startDate || endDate) {
			matchQuery.timestamp = {};
			if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
			if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
		}

		const entityStats = await Interaction.aggregate([
			{ $match: matchQuery },

			{
				$group: {
					_id: "$entityData.entityId",

					entityName: { $first: "$entityData.entityName" },
					entityType: { $first: "$entityData.entityType" },
					attributes: { $first: "$entityData.attributes" },

					views: {
						$sum: {
							$cond: [
								{
									$eq: ["$interactionType", "product_view"],
								},
								1,
								0,
							],
						},
					},

					conversions: {
						$sum: {
							$cond: [{ $eq: ["$actionCategory", "conversion"] }, 1, 0],
						},
					},
					totalInteractions: { $sum: 1 },
				},
			},

			{
				$project: {
					entityId: "$_id",
					entityName: 1,
					entityType: 1,
					attributes: 1,
					views: 1,
					conversions: 1,
					totalInteractions: 1,

					conversionRate: {
						$cond: [
							{ $gt: ["$views", 0] },
							{
								$multiply: [{ $divide: ["$conversions", "$views"] }, 100],
							},
							0,
						],
					},
				},
			},

			{ $sort: { totalInteractions: -1 } },
			{ $limit: 20 },
		]);

		res.status(200).json({
			success: true,
			data: entityStats,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching entity analytics",
			error: error.message,
		});
	}
};


export const getSearchAnalytics = async (req, res) => {
	try {
		const userId = req.user._id;
		const { websiteId, startDate, endDate } = req.query;

		const matchQuery = {
			userId,
			interactionType: "search",
			searchQuery: { $exists: true, $ne: null },
		};

		if (websiteId) matchQuery.websiteId = new mongoose.Types.ObjectId(websiteId);

		if (startDate || endDate) {
			matchQuery.timestamp = {};
			if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
			if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
		}

		const searchStats = await Interaction.aggregate([
			{ $match: matchQuery },
			{
				$group: {
					_id: "$searchQuery",
					count: { $sum: 1 },
					avgResultsCount: { $avg: "$searchResultsCount" },
					lastSearched: { $max: "$timestamp" },
				},
			},
			{ $sort: { count: -1 } },
			{ $limit: 20 },
		]);

		res.status(200).json({
			success: true,
			data: searchStats,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching search analytics",
			error: error.message,
		});
	}
};


export const getUserBehaviorFlow = async (req, res) => {
	try {
		const userId = req.user._id;
		let { sessionId } = req.query;

		if (!sessionId) {
			return res.status(400).json({
				success: false,
				message: "sessionId is required",
			});
		}

		sessionId = new mongoose.Types.ObjectId(sessionId);

		const interactions = await Interaction.find({
			userId,
			sessionId,
			interactionType: { $in: ["view", "product_view"] },
		})
			.sort({ timestamp: 1 })
			.select("pageUrl pageName timestamp");

		
		const flow = interactions.map((int, index) => ({
			step: index + 1,
			page: int.pageName || int.pageUrl,
			timestamp: int.timestamp,
		}));

		res.status(200).json({
			success: true,
			data: {
				sessionId,
				totalSteps: flow.length,
				flow,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching behavior flow",
			error: error.message,
		});
	}
};
