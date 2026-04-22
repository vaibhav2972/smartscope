import api from "./api";

export const analyticsService = {

	getOverview: async () => {
		const response = await api.get("/analytics/overview");
		return response.data;
	},

	checkMLHealth: async () => {
		const response = await api.get("/analytics/ml-health");
		return response.data;
	},


	getUserIntelligence: async (userId) => {
		const response = await api.get(`/analytics/user/${userId}/intelligence`);
		return response.data;
	},

	getUserSummary: async (userId) => {
		const response = await api.get(`/analytics/user/${userId}/summary`);
		return response.data;
	},


	getUserSegments: async () => {
		const response = await api.get("/analytics/segments");
		return response.data;
	},

	getUserSegment: async (userId) => {
		const response = await api.get(`/analytics/user/${userId}/segment`);
		return response.data;
	},


	getEngagementLeaderboard: async () => {
		const response = await api.get("/analytics/engagement/leaderboard");
		return response.data;
	},

	getUserEngagement: async (userId) => {
		const response = await api.get(`/analytics/user/${userId}/engagement`);
		return response.data;
	},


	getRecommendations: async (userId, params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(
			`/analytics/user/${userId}/recommendations?${queryString}`,
		);
		return response.data;
	},

	getSimilarUsers: async (userId, params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(
			`/analytics/user/${userId}/similar-users?${queryString}`,
		);
		return response.data;
	},


	getChurnRisk: async () => {
		const response = await api.get("/analytics/churn-risk");
		return response.data;
	},


	getRFMAnalysis: async () => {
		const response = await api.get("/analytics/rfm");
		return response.data;
	},

	getUserRFM: async (userId) => {
		const response = await api.get(`/analytics/user/${userId}/rfm`);
		return response.data;
	},


	getLifecycleAnalysis: async () => {
		const response = await api.get("/analytics/lifecycle");
		return response.data;
	},

	getBehaviorImportance: async (userId) => {
		const response = await api.get(`/analytics/behavior-importance/${userId}`);
		return response.data;
	},

	getFeatureAttribution: async (userId) => {
		const response = await api.get(`/analytics/feature-attribution/${userId}`);
		return response.data;
	},

	getWebsiteIntelligence: async () => {
		const response = await api.get("/analytics/website-intelligence");
		return response.data;
	},
};
