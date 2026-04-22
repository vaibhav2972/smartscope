import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
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
			default: "custom",
		},
		description: {
			type: String,
		},
		features: {
			type: [String],
			default: [],
		},

		
		config: {
			
			allowedInteractions: {
				type: [String],
				default: ["click", "view", "navigation"],
			},

			
			entityTypes: [
				{
					name: String, 
					displayName: String, 
					fields: {
						type: mongoose.Schema.Types.Mixed,
						
					},
				},
			],

			
			conversionEvents: {
				type: [String],
				default: [],
				
				
				
			},

			
			trackingSettings: {
				type: mongoose.Schema.Types.Mixed,
				default: {},
			},
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const Website = mongoose.model("Website", websiteSchema);
