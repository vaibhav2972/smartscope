import api from "./api";

export const sessionService = {
	
	startSession: async (sessionData) => {
		const response = await api.post("/sessions/start", sessionData);
		return response.data;
	},

	
	endSession: async (sessionId, exitData) => {
		const response = await api.patch(`/sessions/end/${sessionId}`, exitData);
		return response.data;
	},

	
	updateSession: async (sessionId, metricsData) => {
		const response = await api.patch(
			`/sessions/update/${sessionId}`,
			metricsData,
		);
		return response.data;
	},


	getActiveSession: async (websiteId) => {
		const response = await api.get(`/sessions/active?websiteId=${websiteId}`);
		return response.data;
	},

	
	getUserSessions: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(`/sessions/user?${queryString}`);
		return response.data;
	},

	
	getSessionAnalytics: async (params = {}) => {
		const queryString = new URLSearchParams(params).toString();
		const response = await api.get(
			`/sessions/analytics/website?${queryString}`,
		);
		return response.data;
	},

	
	getSessionDetails: async (sessionId) => {
		const response = await api.get(`/sessions/details/${sessionId}`);
		return response.data;
	},
};
