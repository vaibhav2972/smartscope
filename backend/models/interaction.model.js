import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sessionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Session",
			required: true,
		},
		websiteId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Website",
			required: true,
		},

		interactionType: {
			type: String,
			required: true,
		},

		actionCategory: {
			type: String,
			enum: [
				"engagement",
				"conversion",
				"navigation",
				"content_interaction",
				"social",
				"custom",
			],
			default: "engagement",
		},

		elementId: {
			type: String,
		},
		elementType: {
			type: String,
		},
		elementText: {
			type: String,
		},
		pageUrl: {
			type: String,
			required: true,
		},
		pageName: {
			type: String,
		},
		scrollDepth: {
			type: Number,
			min: 0,
			max: 100,
		},
		coordinates: {
			x: Number,
			y: Number,
		},
		timestamp: {
			type: Date,
			default: Date.now,
			required: true,
		},
		timeOnElement: {
			type: Number,
		},

		entityData: {
			entityType: String, 
			entityId: String,
			entityName: String,

			attributes: {
				type: mongoose.Schema.Types.Mixed,
				default: {},
			},
		},

		searchQuery: {
			type: String,
		},
		searchResultsCount: {
			type: Number,
		},
		formData: {
			formId: String,
			fieldName: String,
			fieldValue: String,
			validationError: String,
		},
		previousInteraction: {
			type: String,
		},
		viewportSize: {
			width: Number,
			height: Number,
		},
		referrer: {
			type: String,
		},

		customData: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},

		metadata: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
	},
	{ timestamps: true },
);

interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ sessionId: 1, timestamp: 1 });
interactionSchema.index({ websiteId: 1, interactionType: 1 });
interactionSchema.index({ "entityData.entityId": 1 });
interactionSchema.index({ actionCategory: 1 });
interactionSchema.index({ searchQuery: "text" });

export const Interaction = mongoose.model("Interaction", interactionSchema);
