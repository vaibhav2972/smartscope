import { Website } from "../models/website.model.js";


export const getAllWebsites = async (req, res) => {
	try {
		const websites = await Website.find({ isActive: true });
		res.status(200).json({
			success: true,
			data: websites,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching websites",
			error: error.message,
		});
	}
};


export const getWebsiteById = async (req, res) => {
	try {
		const { id } = req.params;
		const website = await Website.findById(id);

		if (!website) {
			return res.status(404).json({
				success: false,
				message: "Website not found",
			});
		}

		res.status(200).json({
			success: true,
			data: website,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching website",
			error: error.message,
		});
	}
};


export const createWebsite = async (req, res) => {
	try {
		const { name, type, description, features } = req.body;

		const website = await Website.create({
			name,
			type,
			description,
			features,
		});

		res.status(201).json({
			success: true,
			message: "Website created successfully",
			data: website,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating website",
			error: error.message,
		});
	}
};
