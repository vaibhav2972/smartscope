import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { Interaction } from "../models/interaction.model.js";

const TEST_USER_PREFIX = "test_";

async function cleanupTestData() {
	try {
		console.log("\n🧹 Starting Test Data Cleanup...\n");

		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✓ Connected to MongoDB\n");

		
		const testUsers = await User.find({
			username: { $regex: `^${TEST_USER_PREFIX}` },
		});

		if (testUsers.length === 0) {
			console.log("✓ No test users found. Database is clean.\n");
			return;
		}

		const testUserIds = testUsers.map((u) => u._id);

		console.log(`Found ${testUsers.length} test users\n`);

		
		console.log("Deleting test interactions...");
		const interactionsResult = await Interaction.deleteMany({
			userId: { $in: testUserIds },
		});
		console.log(`✓ Deleted ${interactionsResult.deletedCount} interactions\n`);

		
		console.log("Deleting test sessions...");
		const sessionsResult = await Session.deleteMany({
			userId: { $in: testUserIds },
		});
		console.log(`✓ Deleted ${sessionsResult.deletedCount} sessions\n`);

		
		console.log("Deleting test users...");
		const usersResult = await User.deleteMany({
			username: { $regex: `^${TEST_USER_PREFIX}` },
		});
		console.log(`✓ Deleted ${usersResult.deletedCount} users\n`);

		console.log("=".repeat(60));
		console.log("✅ CLEANUP COMPLETE!");
		console.log("=".repeat(60));
		console.log(`📊 Summary:`);
		console.log(`   Users removed: ${usersResult.deletedCount}`);
		console.log(`   Sessions removed: ${sessionsResult.deletedCount}`);
		console.log(`   Interactions removed: ${interactionsResult.deletedCount}`);
		console.log("=".repeat(60) + "\n");
	} catch (error) {
		console.error("❌ Error during cleanup:", error);
	} finally {
		await mongoose.disconnect();
		console.log("✓ Disconnected from MongoDB\n");
	}
}


cleanupTestData();
