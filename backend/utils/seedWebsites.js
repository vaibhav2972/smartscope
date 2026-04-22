import { Website } from "../models/website.model.js";
import connectDB from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const websites = [
	{
		name: "ShopVibe",
		type: "ecommerce",
		description: "Modern e-commerce platform for fashion and accessories",
		features: [
			"Product browsing",
			"Shopping cart",
			"Wishlist",
			"Product search",
			"Category filtering",
		],
	},
	{
		name: "SocialConnect",
		type: "social",
		description: "Social media platform for connecting with friends",
		features: [
			"News feed",
			"Like & comment",
			"Share posts",
			"Follow users",
			"Direct messaging",
		],
	},
	{
		name: "TechBlog",
		type: "blog",
		description: "Technology news and articles platform",
		features: [
			"Article reading",
			"Comments",
			"Bookmarks",
			"Search articles",
			"Category browsing",
		],
	},
	{
		name: "DataDash",
		type: "dashboard",
		description: "Analytics and metrics dashboard",
		features: [
			"Data visualization",
			"Chart interactions",
			"Filter data",
			"Export reports",
			"Real-time updates",
		],
	},
];

const seedWebsites = async () => {
	try {
		await connectDB();

		await Website.deleteMany({});
		console.log("Cleared existing websites");

		const result = await Website.insertMany(websites);
		console.log(`✅ Seeded ${result.length} websites successfully`);

		process.exit(0);
	} catch (error) {
		console.error("Error seeding websites:", error);
		process.exit(1);
	}
};

seedWebsites();
