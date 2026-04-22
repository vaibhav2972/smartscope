/**
 * Realistic Test Data Generator for SmartScope
 * Generates authentic user behavior patterns based on actual demo websites
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { Interaction } from "../models/interaction.model.js";
import { Website } from "../models/website.model.js";


const CONFIG = {
	NUM_USERS: 50, 
	DAYS_OF_DATA: 30, 
	MIN_SESSIONS_PER_USER: 1,
	MAX_SESSIONS_PER_USER: 15,
	TEST_USER_PREFIX: "test_", 
};



const DEMO_WEBSITES = {
	ecommerce: {
		name: "ShopVibe",
		url: "/demo/ecommerce",
		category: "ecommerce",
		products: [
			{
				id: "prod_1",
				name: "Wireless Headphones Pro",
				price: 2999,
				category: "Electronics",
			},
			{
				id: "prod_2",
				name: "Smart Watch Ultra",
				price: 8999,
				category: "Electronics",
			},
			{
				id: "prod_3",
				name: "Premium Laptop Backpack",
				price: 1499,
				category: "Accessories",
			},
			{
				id: "prod_4",
				name: "USB-C Fast Charging Cable",
				price: 299,
				category: "Accessories",
			},
			{
				id: "prod_5",
				name: "Bluetooth Speaker Max",
				price: 3499,
				category: "Electronics",
			},
			{
				id: "prod_6",
				name: "Designer Phone Case",
				price: 499,
				category: "Accessories",
			},
			{
				id: "prod_7",
				name: "Gaming Mouse RGB",
				price: 1999,
				category: "Electronics",
			},
			{
				id: "prod_8",
				name: "Mechanical Keyboard",
				price: 4999,
				category: "Electronics",
			},
			{
				id: "prod_9",
				name: "Webcam HD Pro",
				price: 2499,
				category: "Electronics",
			},
			{
				id: "prod_10",
				name: "Portable Power Bank",
				price: 1299,
				category: "Accessories",
			},
			{
				id: "prod_11",
				name: "Wireless Earbuds",
				price: 1999,
				category: "Electronics",
			},
			{
				id: "prod_12",
				name: "Laptop Stand Aluminum",
				price: 899,
				category: "Accessories",
			},
		],
		interactions: [
			{
				id: "search-button",
				type: "search",
				text: "Search",
				elementType: "button",
			},
			{
				id: "filter-button",
				type: "filter",
				text: "Filters",
				elementType: "button",
			},
			{ id: "sort-select", type: "sort", text: "Sort", elementType: "select" },
			{
				id: "wishlist-icon",
				type: "wishlist",
				text: "View Wishlist",
				elementType: "button",
			},
			{
				id: "cart-icon",
				type: "cart",
				text: "View Cart",
				elementType: "button",
			},
			{
				id: "checkout-button",
				type: "checkout",
				text: "Proceed to Checkout",
				elementType: "button",
			},
		],
		userJourneys: [
			{
				name: "Window Shopper",
				pattern: ["search", "filter", "product_view", "product_view"],
				conversionRate: 0.05,
				avgDuration: [90, 180],
				interactionCount: [4, 8],
			},
			{
				name: "Buyer",
				pattern: [
					"search",
					"product_view",
					"wishlist_add",
					"add_to_cart",
					"checkout",
				],
				conversionRate: 0.85,
				avgDuration: [240, 420],
				interactionCount: [8, 15],
			},
			{
				name: "Deal Seeker",
				pattern: [
					"filter",
					"sort",
					"product_view",
					"product_view",
					"add_to_cart",
				],
				conversionRate: 0.6,
				avgDuration: [180, 300],
				interactionCount: [6, 12],
			},
			{
				name: "Quick Browser",
				pattern: ["product_view", "product_view"],
				conversionRate: 0.1,
				avgDuration: [30, 90],
				interactionCount: [2, 5],
			},
		],
	},
	social: {
		name: "SocialConnect",
		url: "/demo/social",
		category: "social",
		posts: [
			{
				id: "post_1",
				author: "Tech Enthusiast",
				content: "Just built an amazing AI-powered chatbot",
			},
			{
				id: "post_2",
				author: "Design Guru",
				content: "New UI design trends for 2024",
			},
			{ id: "post_3", author: "Code Ninja", content: "Pro tip for developers" },
			{ id: "post_4", author: "Startup Founder", content: "HUGE MILESTONE!" },
			{
				id: "post_5",
				author: "Data Scientist",
				content: "Working on an exciting data visualization project",
			},
			{
				id: "post_6",
				author: "Web Developer",
				content: "Just finished a 48-hour coding marathon",
			},
		],
		interactions: [
			{
				id: "create-post",
				type: "post_create",
				text: "Create Post",
				elementType: "button",
			},
			{
				id: "add-image",
				type: "add_image",
				text: "Add Image",
				elementType: "button",
			},
			{
				id: "load-more",
				type: "load_more",
				text: "Load More Posts",
				elementType: "button",
			},
		],
		userJourneys: [
			{
				name: "Lurker",
				pattern: ["scroll", "post_view", "post_view"],
				conversionRate: 0.05,
				avgDuration: [180, 360],
				interactionCount: [3, 7],
			},
			{
				name: "Engager",
				pattern: ["scroll", "like", "comment", "like", "share"],
				conversionRate: 0.7,
				avgDuration: [300, 540],
				interactionCount: [8, 16],
			},
			{
				name: "Creator",
				pattern: ["post_create", "scroll", "like", "comment"],
				conversionRate: 0.9,
				avgDuration: [360, 600],
				interactionCount: [10, 20],
			},
		],
	},
	blog: {
		name: "TechBlog",
		url: "/demo/blog",
		category: "content",
		articles: [
			{
				id: "article_1",
				title: "The Future of AI in Web Development",
				category: "Technology",
				readTime: "5 min",
			},
			{
				id: "article_2",
				title: "Mastering React Hooks in 2024",
				category: "Development",
				readTime: "8 min",
			},
			{
				id: "article_3",
				title: "Building Scalable Backend Systems",
				category: "Backend",
				readTime: "10 min",
			},
			{
				id: "article_4",
				title: "UI/UX Design Trends 2024",
				category: "Design",
				readTime: "6 min",
			},
			{
				id: "article_5",
				title: "Getting Started with Machine Learning",
				category: "Technology",
				readTime: "7 min",
			},
			{
				id: "article_6",
				title: "Cybersecurity Best Practices",
				category: "Backend",
				readTime: "9 min",
			},
		],
		interactions: [
			{ id: "search", type: "search", text: "Search", elementType: "search" },
			{
				id: "bookmarks",
				type: "bookmarks",
				text: "View Bookmarks",
				elementType: "button",
			},
		],
		userJourneys: [
			{
				name: "Casual Reader",
				pattern: ["search", "article_view", "scroll"],
				conversionRate: 0.3,
				avgDuration: [180, 300],
				interactionCount: [4, 8],
			},
			{
				name: "Engaged Reader",
				pattern: ["article_view", "like", "bookmark", "share", "article_view"],
				conversionRate: 0.8,
				avgDuration: [360, 600],
				interactionCount: [8, 15],
			},
			{
				name: "Browser",
				pattern: ["category_filter", "article_view", "article_view"],
				conversionRate: 0.4,
				avgDuration: [240, 420],
				interactionCount: [5, 10],
			},
		],
	},
	dashboard: {
		name: "DataDash",
		url: "/demo/dashboard",
		category: "saas",
		metrics: [
			{ id: "revenue", label: "Total Revenue" },
			{ id: "users", label: "Active Users" },
			{ id: "orders", label: "Total Orders" },
			{ id: "conversion", label: "Conversion Rate" },
		],
		interactions: [
			{
				id: "refresh-data",
				type: "refresh",
				text: "Refresh Dashboard",
				elementType: "button",
			},
			{
				id: "export-data",
				type: "export",
				text: "Export Dashboard Data",
				elementType: "button",
			},
			{
				id: "filter-button",
				type: "filter",
				text: "Open Filters",
				elementType: "button",
			},
		],
		userJourneys: [
			{
				name: "Quick Viewer",
				pattern: ["metric_view", "chart_view"],
				conversionRate: 0.4,
				avgDuration: [120, 240],
				interactionCount: [3, 7],
			},
			{
				name: "Analyst",
				pattern: [
					"metric_view",
					"filter",
					"chart_view",
					"drill_down",
					"export",
				],
				conversionRate: 0.85,
				avgDuration: [300, 540],
				interactionCount: [10, 18],
			},
			{
				name: "Manager",
				pattern: ["metric_view", "timerange", "chart_view", "export"],
				conversionRate: 0.7,
				avgDuration: [180, 360],
				interactionCount: [6, 12],
			},
		],
	},
};



const getRandomElement = (array) =>
	array[Math.floor(Math.random() * array.length)];

const getRandomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min, max, decimals = 2) => {
	const value = Math.random() * (max - min) + min;
	return parseFloat(value.toFixed(decimals));
};

const generateRealisticTimestamp = (daysAgo) => {
	const now = new Date();
	const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

	
	const hour = getRandomInt(0, 23);
	const businessHoursBias = hour >= 9 && hour <= 18 ? 0.7 : 0.3;

	if (Math.random() > businessHoursBias) {
		pastDate.setHours(getRandomInt(0, 8)); 
	} else {
		pastDate.setHours(getRandomInt(9, 18)); 
	}

	pastDate.setMinutes(getRandomInt(0, 59));
	pastDate.setSeconds(getRandomInt(0, 59));

	return pastDate;
};

const deviceTypes = ["desktop", "mobile", "tablet"];
const devicePlatforms = {
	desktop: ["Win32", "MacIntel", "Linux x86_64"],
	mobile: ["iPhone", "Android"],
	tablet: ["iPad", "Android"],
};
const userAgents = {
	desktop: [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
	],
	mobile: [
		"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
	],
	tablet: [
		"Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
	],
};

const screenResolutions = {
	desktop: ["1920x1080", "1366x768", "1536x864", "1280x720", "2560x1440"],
	mobile: ["375x667", "414x896", "360x640", "390x844"],
	tablet: ["768x1024", "810x1080", "834x1194"],
};

const countries = [
	"India",
	"United States",
	"United Kingdom",
	"Canada",
	"Australia",
	"Germany",
	"France",
];
const cities = {
	India: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"],
	"United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
	"United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
	Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
	Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
	Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
	France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
};

const referralSources = [
	"direct",
	"https://www.google.com",
	"https://www.facebook.com",
	"https://twitter.com",
	"https://www.linkedin.com",
	"https://www.reddit.com",
	"email",
];


async function createTestUser() {
	const username = `${CONFIG.TEST_USER_PREFIX}${faker.internet.username().toLowerCase()}`;
	const email = `${CONFIG.TEST_USER_PREFIX}${faker.internet.email().toLowerCase()}`;

	const user = await User.create({
		username,
		email,
		passwordHash:
			"$2b$10$gxAqXw.K09sNgzpN7qtVL.YUfXAKeaHlRBAiUWQQtfUtT5M1fSCCG", 
		verified: true,
		role: "user",
		avatar: faker.image.avatar(),
	});

	console.log(`✓ Created user: ${username}`);
	return user;
}

async function generateSessionForWebsite(
	user,
	websiteDoc,
	websiteData,
	daysAgo,
) {
	const journey = getRandomElement(websiteData.userJourneys);
	const hasConversion = Math.random() < journey.conversionRate;

	const deviceType = getRandomElement(deviceTypes);
	const platform = getRandomElement(devicePlatforms[deviceType]);
	const userAgent = getRandomElement(userAgents[deviceType]);
	const screenRes = getRandomElement(screenResolutions[deviceType]);
	const country = getRandomElement(countries);
	const city = getRandomElement(cities[country]);

	const sessionStart = generateRealisticTimestamp(daysAgo);
	const duration = getRandomInt(...journey.avgDuration);
	const sessionEnd = new Date(sessionStart.getTime() + duration * 1000);

	const interactionCount = getRandomInt(...journey.interactionCount);

	const session = await Session.create({
		userId: user._id,
		websiteId: websiteDoc._id,
		sessionStart,
		sessionEnd,
		duration,
		totalInteractions: interactionCount,
		totalClicks: Math.floor(interactionCount * 0.6),
		totalScrolls: Math.floor(interactionCount * 0.2),
		pagesVisited: 1,
		uniquePagesVisited: [websiteData.url],
		maxScrollDepth: getRandomInt(20, 100),
		bounceRate: journey.pattern.length <= 2,
		conversionEvents: hasConversion
			? [getConversionEvent(websiteData.category)]
			: [],
		hasConversion,
		exitPage: websiteData.url,
		exitIntent: Math.random() < 0.2,
		deviceInfo: {
			userAgent,
			platform,
			screenResolution: screenRes,
			deviceType,
		},
		ipAddress: faker.internet.ip(),
		location: {
			country,
			city,
			timezone: "Asia/Calcutta",
		},
		referralSource: getRandomElement(referralSources),
		isActive: false,
	});

	return { session, journey, interactionCount, duration, sessionStart };
}

function getConversionEvent(category) {
	const events = {
		ecommerce: "add_to_cart",
		social: "post_create",
		content: "subscription",
		saas: "download",
	};
	return events[category] || "conversion";
}

async function generateInteractionsForSession(
	session,
	user,
	websiteDoc,
	websiteData,
	journey,
	count,
	duration,
	sessionStart,
) {
	const interactions = [];
	const timePerInteraction = duration / count;

	for (let i = 0; i < count; i++) {
		const timestamp = new Date(
			sessionStart.getTime() + i * timePerInteraction * 1000,
		);
		const actionType = journey.pattern[i % journey.pattern.length];

		const interaction = generateInteractionByType(
			actionType,
			user,
			session,
			websiteDoc,
			websiteData,
			timestamp,
		);

		if (interaction) {
			interactions.push(interaction);
		}
	}

	if (interactions.length > 0) {
		await Interaction.insertMany(interactions);
		console.log(`  ✓ Created ${interactions.length} interactions for session`);
	}

	return interactions;
}

function generateInteractionByType(
	actionType,
	user,
	session,
	websiteDoc,
	websiteData,
	timestamp,
) {
	const baseInteraction = {
		userId: user._id,
		sessionId: session._id,
		websiteId: websiteDoc._id,
		pageUrl: websiteData.url,
		timestamp,
		viewportSize: {
			width: getRandomInt(1200, 1920),
			height: getRandomInt(600, 1080),
		},
		coordinates: {
			x: getRandomInt(50, 800),
			y: getRandomInt(50, 600),
		},
	};

	switch (actionType) {
		case "product_view":
			if (websiteData.products) {
				const product = getRandomElement(websiteData.products);
				return {
					...baseInteraction,
					interactionType: "product_view",
					actionCategory: "engagement",
					elementId: `product-${product.id}`,
					elementType: "card",
					elementText: product.name,
					entityData: {
						entityType: "product",
						entityId: product.id,
						entityName: product.name,
						attributes: {
							price: product.price,
							category: product.category,
						},
					},
				};
			}
			break;

		case "add_to_cart":
			if (websiteData.products) {
				const product = getRandomElement(websiteData.products);
				return {
					...baseInteraction,
					interactionType: "add_to_cart",
					actionCategory: "conversion",
					elementId: `add-to-cart-${product.id}`,
					elementType: "button",
					elementText: "Add to Cart",
					entityData: {
						entityType: "product",
						entityId: product.id,
						entityName: product.name,
						attributes: {
							price: product.price,
						},
					},
				};
			}
			break;

		case "wishlist_add":
			if (websiteData.products) {
				const product = getRandomElement(websiteData.products);
				return {
					...baseInteraction,
					interactionType: "wishlist_add",
					actionCategory: "engagement",
					elementId: `wishlist-${product.id}`,
					elementType: "button",
					elementText: "Add to Wishlist",
					entityData: {
						entityType: "product",
						entityId: product.id,
						entityName: product.name,
					},
				};
			}
			break;

		case "like":
			if (websiteData.posts) {
				const post = getRandomElement(websiteData.posts);
				return {
					...baseInteraction,
					interactionType: "like",
					actionCategory: "engagement",
					elementId: `like-${post.id}`,
					elementType: "button",
					elementText: "Like",
					entityData: {
						entityType: "post",
						entityId: post.id,
						entityName: post.content.substring(0, 50),
					},
				};
			}
			break;

		case "comment":
			if (websiteData.posts) {
				const post = getRandomElement(websiteData.posts);
				return {
					...baseInteraction,
					interactionType: "comment",
					actionCategory: "social",
					elementId: `comment-${post.id}`,
					elementType: "button",
					elementText: "Toggle Comments",
					entityData: {
						entityType: "post",
						entityId: post.id,
					},
				};
			}
			break;

		case "article_view":
			if (websiteData.articles) {
				const article = getRandomElement(websiteData.articles);
				return {
					...baseInteraction,
					interactionType: "view",
					actionCategory: "content_interaction",
					elementId: `article-${article.id}`,
					elementType: "card",
					elementText: article.title,
					pageName: `Article: ${article.title}`,
					entityData: {
						entityType: "article",
						entityId: article.id,
						entityName: article.title,
						attributes: {
							category: article.category,
							readTime: article.readTime,
						},
					},
				};
			}
			break;

		case "search":
			const searchQueries = [
				"headphones",
				"laptop",
				"phone",
				"watch",
				"keyboard",
				"mouse",
			];
			return {
				...baseInteraction,
				interactionType: "search",
				actionCategory: "navigation",
				elementId: "search-button",
				elementType: "button",
				elementText: "Search",
				searchQuery: getRandomElement(searchQueries),
				searchResultsCount: getRandomInt(5, 30),
			};

		case "filter":
		case "sort":
		case "scroll":
		case "checkout":
		case "share":
		case "bookmark":
		case "export":
		case "refresh":
		case "metric_view":
		case "chart_view":
			const interaction = websiteData.interactions?.find(
				(i) => i.type === actionType,
			) || { id: actionType, text: actionType, elementType: "button" };
			return {
				...baseInteraction,
				interactionType: actionType,
				actionCategory: actionType === "checkout" ? "conversion" : "engagement",
				elementId: interaction.id,
				elementType: interaction.elementType,
				elementText: interaction.text,
			};

		default:
			return {
				...baseInteraction,
				interactionType: "click",
				actionCategory: "engagement",
				elementId: `element-${actionType}`,
				elementType: "button",
				elementText: actionType,
			};
	}

	return null;
}



async function generateRealisticTestData() {
	try {
		console.log("\n🚀 Starting Realistic Test Data Generation...\n");

		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✓ Connected to MongoDB\n");

		
		const websites = {};

		for (const [key, data] of Object.entries(DEMO_WEBSITES)) {
			const website = await Website.findOne({
				$or: [{ type: key }, { category: data.category }, { name: data.name }],
			});

			if (website) {
				websites[key] = { doc: website, data };
				console.log(`✓ Found website: ${data.name} (${website._id})`);
			} else {
				console.log(`⚠ Warning: Website not found for ${key}`);
			}
		}

		console.log("");

		
		console.log(`Creating ${CONFIG.NUM_USERS} test users...`);
		const users = [];
		for (let i = 0; i < CONFIG.NUM_USERS; i++) {
			const user = await createTestUser();
			users.push(user);
		}
		console.log(`\n✓ Created ${users.length} test users\n`);

		
		console.log("Generating sessions and interactions...\n");
		let totalSessions = 0;
		let totalInteractions = 0;

		for (const user of users) {
			const numSessions = getRandomInt(
				CONFIG.MIN_SESSIONS_PER_USER,
				CONFIG.MAX_SESSIONS_PER_USER,
			);

			for (let i = 0; i < numSessions; i++) {
				
				const websiteKeys = Object.keys(websites);
				const randomWebsiteKey = getRandomElement(websiteKeys);
				const { doc: websiteDoc, data: websiteData } =
					websites[randomWebsiteKey];

				
				const daysAgo = getRandomInt(0, CONFIG.DAYS_OF_DATA);

				
				const { session, journey, interactionCount, duration, sessionStart } =
					await generateSessionForWebsite(
						user,
						websiteDoc,
						websiteData,
						daysAgo,
					);

				totalSessions++;

				
				await generateInteractionsForSession(
					session,
					user,
					websiteDoc,
					websiteData,
					journey,
					interactionCount,
					duration,
					sessionStart,
				);

				totalInteractions += interactionCount;
			}

			console.log(
				`✓ Completed data for user: ${user.username} (${numSessions} sessions)`,
			);
		}

		console.log("\n" + "=".repeat(60));
		console.log("✅ TEST DATA GENERATION COMPLETE!");
		console.log("=".repeat(60));
		console.log(`📊 Summary:`);
		console.log(`   Users created: ${users.length}`);
		console.log(`   Sessions created: ${totalSessions}`);
		console.log(`   Interactions created: ${totalInteractions}`);
		console.log(`   Data period: Last ${CONFIG.DAYS_OF_DATA} days`);
		console.log("=".repeat(60) + "\n");
	} catch (error) {
		console.error("❌ Error generating test data:", error);
	} finally {
		await mongoose.disconnect();
		console.log("✓ Disconnected from MongoDB\n");
	}
}


generateRealisticTestData();
