import mongoose from "mongoose";

const platformConfigSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		displayName: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: [
				"ecommerce",
				"social",
				"content",
				"saas",
				"gaming",
				"education",
				"custom",
			],
			required: true,
		},

		interactionTypes: [
			{
				type: {
					type: String,
					required: true,
				},
				category: String,
				description: String,
				isConversion: Boolean,
			},
		],

		entityTypes: [
			{
				name: String,
				displayName: String,
				schema: {
					type: mongoose.Schema.Types.Mixed,
				},
			},
		],

		metrics: [
			{
				name: { type: String, required: true },
				displayName: { type: String },
				type: { type: String },
				calculation: { type: String },
			},
		],

		mlConfig: {
			clusteringFeatures: [String],
			classificationTarget: String,
			recommendationBasis: String,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const PlatformConfig = mongoose.model(
	"PlatformConfig",
	platformConfigSchema,
);
