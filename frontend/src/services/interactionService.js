import api from "./api";

export const interactionService = {

	trackInteraction: async (interactionData) => {
		const response = await api.post("/interactions/track", interactionData);
		return response.data;
	},


	trackBulkInteractions: async (interactions) => {
		const response = await api.post("/interactions/track/bulk", {
			interactions,
		});
		return response.data;
	},

	
	getUserInteractions: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(`/interactions/user?${queryString}`);
		return response.data;
	},

	
	getInteractionStats: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(`/interactions/stats?${queryString}`);
		return response.data;
	},

	
	getItemAnalytics: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(
			`/interactions/analytics/items?${queryString}`,
		);
		return response.data;
	},


	getSearchAnalytics: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(
			`/interactions/analytics/search?${queryString}`,
		);
		return response.data;
	},


	getUserBehaviorFlow: async (sessionId) => {
		const response = await api.get(`/interactions/flow?sessionId=${sessionId}`);
		return response.data;
	},
};
