import api from "./api";

export const websiteService = {
	
	getAllWebsites: async () => {
		const response = await api.get("/websites");
		return response.data;
	},

	
	getWebsiteById: async (websiteId) => {
		const response = await api.get(`/websites/${websiteId}`);
		return response.data;
	},


	createWebsite: async (websiteData) => {
		const response = await api.post("/websites", websiteData);
		return response.data;
	},
};
