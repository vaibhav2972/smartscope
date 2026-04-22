import { PlatformConfig } from "../models/platformConfig.model.js";
import connectDB from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const platformConfigs = [
	{
		name: "ecommerce",
		displayName: "E-Commerce Platform",
		category: "ecommerce",
		interactionTypes: [
			{
				type: "product_view",
				category: "engagement",
				description: "User viewed product",
				isConversion: false,
			},
			{
				type: "add_to_cart",
				category: "conversion",
				description: "Added to cart",
				isConversion: true,
			},
			{
				type: "checkout_start",
				category: "conversion",
				description: "Started checkout",
				isConversion: true,
			},
			{
				type: "purchase",
				category: "conversion",
				description: "Completed purchase",
				isConversion: true,
			},
			{
				type: "wishlist_add",
				category: "engagement",
				description: "Added to wishlist",
				isConversion: false,
			},
			{
				type: "search",
				category: "navigation",
				description: "Searched products",
				isConversion: false,
			},
			{
				type: "filter_apply",
				category: "navigation",
				description: "Applied filter",
				isConversion: false,
			},
		],
		entityTypes: [
			{
				name: "product",
				displayName: "Product",
				schema: {
					price: "number",
					category: "string",
					brand: "string",
					rating: "number",
					inStock: "boolean",
				},
			},
		],
		metrics: [
			{
				name: "cart_abandonment_rate",
				displayName: "Cart Abandonment Rate",
				type: "percentage",
				calculation: "(add_to_cart - purchase) / add_to_cart",
			},
			{
				name: "avg_order_value",
				displayName: "Average Order Value",
				type: "average",
				calculation: "sum(purchase.price) / count(purchase)",
			},
		],
		mlConfig: {
			clusteringFeatures: [
				"session_duration",
				"total_clicks",
				"products_viewed",
				"cart_adds",
				"purchase_count",
			],
			classificationTarget: "purchase_likelihood",
			recommendationBasis: "collaborative_filtering",
		},
	},

	{
		name: "social_media",
		displayName: "Social Media Platform",
		category: "social",
		interactionTypes: [
			{
				type: "post_view",
				category: "engagement",
				description: "Viewed post",
				isConversion: false,
			},
			{
				type: "like",
				category: "engagement",
				description: "Liked content",
				isConversion: false,
			},
			{
				type: "unlike",
				category: "engagement",
				description: "Unliked content",
				isConversion: false,
			},
			{
				type: "comment",
				category: "social",
				description: "Commented on post",
				isConversion: true,
			},
			{
				type: "share",
				category: "social",
				description: "Shared content",
				isConversion: true,
			},
			{
				type: "follow",
				category: "conversion",
				description: "Followed user",
				isConversion: true,
			},
			{
				type: "unfollow",
				category: "conversion",
				description: "Unfollowed user",
				isConversion: false,
			},
			{
				type: "send_message",
				category: "social",
				description: "Sent message",
				isConversion: false,
			},
		],
		entityTypes: [
			{
				name: "post",
				displayName: "Social Post",
				schema: {
					likes: "number",
					comments: "number",
					shares: "number",
					postType: "string", // "text", "image", "video"
					authorId: "string",
				},
			},
		],
		metrics: [
			{
				name: "engagement_rate",
				displayName: "Engagement Rate",
				type: "percentage",
				calculation: "(likes + comments + shares) / post_views",
			},
			{
				name: "viral_coefficient",
				displayName: "Viral Coefficient",
				type: "ratio",
				calculation: "shares / post_views",
			},
		],
		mlConfig: {
			clusteringFeatures: [
				"session_duration",
				"posts_viewed",
				"likes",
				"comments",
				"shares",
			],
			classificationTarget: "engagement_level",
			recommendationBasis: "content_based_filtering",
		},
	},

	{
		name: "online_learning",
		displayName: "Online Learning Platform",
		category: "education",
		interactionTypes: [
			{
				type: "course_view",
				category: "engagement",
				description: "Viewed course",
				isConversion: false,
			},
			{
				type: "enroll",
				category: "conversion",
				description: "Enrolled in course",
				isConversion: true,
			},
			{
				type: "start_lesson",
				category: "engagement",
				description: "Started lesson",
				isConversion: false,
			},
			{
				type: "complete_lesson",
				category: "conversion",
				description: "Completed lesson",
				isConversion: true,
			},
			{
				type: "take_quiz",
				category: "engagement",
				description: "Took quiz",
				isConversion: false,
			},
			{
				type: "certificate_earn",
				category: "conversion",
				description: "Earned certificate",
				isConversion: true,
			},
			{
				type: "pause_video",
				category: "engagement",
				description: "Paused video",
				isConversion: false,
			},
			{
				type: "bookmark",
				category: "engagement",
				description: "Bookmarked content",
				isConversion: false,
			},
		],
		entityTypes: [
			{
				name: "course",
				displayName: "Course",
				schema: {
					duration: "number",
					difficulty: "string",
					rating: "number",
					enrollments: "number",
					completionRate: "number",
				},
			},
		],
		metrics: [
			{
				name: "course_completion_rate",
				displayName: "Course Completion Rate",
				type: "percentage",
				calculation: "complete_course / enroll",
			},
			{
				name: "avg_study_time",
				displayName: "Average Study Time",
				type: "duration",
				calculation: "avg(session_duration)",
			},
		],
		mlConfig: {
			clusteringFeatures: [
				"courses_enrolled",
				"lessons_completed",
				"avg_session_duration",
				"quiz_scores",
			],
			classificationTarget: "dropout_risk",
			recommendationBasis: "skill_based_recommendation",
		},
	},

	{
		name: "gaming",
		displayName: "Gaming Platform",
		category: "gaming",
		interactionTypes: [
			{
				type: "game_start",
				category: "engagement",
				description: "Started game",
				isConversion: false,
			},
			{
				type: "level_complete",
				category: "conversion",
				description: "Completed level",
				isConversion: true,
			},
			{
				type: "achievement_unlock",
				category: "conversion",
				description: "Unlocked achievement",
				isConversion: true,
			},
			{
				type: "purchase_item",
				category: "conversion",
				description: "Purchased in-game item",
				isConversion: true,
			},
			{
				type: "join_multiplayer",
				category: "social",
				description: "Joined multiplayer",
				isConversion: false,
			},
			{
				type: "invite_friend",
				category: "social",
				description: "Invited friend",
				isConversion: true,
			},
		],
		entityTypes: [
			{
				name: "game",
				displayName: "Game",
				schema: {
					level: "number",
					score: "number",
					difficulty: "string",
					playtime: "number",
				},
			},
		],
		metrics: [
			{
				name: "retention_rate",
				displayName: "Player Retention Rate",
				type: "percentage",
				calculation: "returning_players / total_players",
			},
			{
				name: "avg_session_length",
				displayName: "Average Session Length",
				type: "duration",
				calculation: "avg(session_duration)",
			},
		],
		mlConfig: {
			clusteringFeatures: [
				"playtime",
				"levels_completed",
				"achievements",
				"purchases",
			],
			classificationTarget: "churn_risk",
			recommendationBasis: "gameplay_similarity",
		},
	},
];

const seedPlatformConfigs = async () => {
	try {
		await connectDB();
		await PlatformConfig.deleteMany({});
		console.log("Cleared existing platform configs");

		const result = await PlatformConfig.insertMany(platformConfigs);
		console.log(
			`✅ Seeded ${result.length} platform configurations successfully`,
		);

		process.exit(0);
	} catch (error) {
		console.error("Error seeding platform configs:", error);
		process.exit(1);
	}
};

seedPlatformConfigs();
