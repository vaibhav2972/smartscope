import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		websiteId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Website",
			required: true,
		},
		sessionStart: {
			type: Date,
			required: true,
			default: Date.now,
		},
		sessionEnd: {
			type: Date,
		},
		duration: {
			type: Number, 
			default: 0,
		},

		totalInteractions: {
			type: Number,
			default: 0,
		},
		totalClicks: {
			type: Number,
			default: 0,
		},
		totalScrolls: {
			type: Number,
			default: 0,
		},
		pagesVisited: {
			type: Number,
			default: 0,
		},
		uniquePagesVisited: {
			type: [String], 
			default: [],
		},

		maxScrollDepth: {
			type: Number,
			default: 0,
		},
		bounceRate: {
			type: Boolean, 
			default: false,
		},


		conversionEvents: {
			type: [String], 
			default: [],
		},
		hasConversion: {
			type: Boolean,
			default: false,
		},

		
		exitPage: {
			type: String,
		},
		exitIntent: {
			type: Boolean,
			default: false,
		},

		deviceInfo: {
			userAgent: String,
			platform: String,
			screenResolution: String,
			deviceType: {
				type: String,
				enum: ["mobile", "tablet", "desktop"],
			},
		},
		ipAddress: {
			type: String,
		},

	
		location: {
			country: String,
			city: String,
			timezone: String,
		},

		
		referralSource: {
			type: String,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

sessionSchema.index({ userId: 1, websiteId: 1, sessionStart: -1 });
sessionSchema.index({ hasConversion: 1 }); 

export const Session = mongoose.model("Session", sessionSchema);
