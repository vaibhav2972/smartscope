import api from "./api";

export const authService = {
	
	signup: async (userData) => {
		const response = await api.post("/user/signup", userData);
		return response.data;
	},

	
	adminSignup: async (userData) => {
		const response = await api.post("/user/adminsignup", userData);
		return response.data;
	},

	
	login: async (credentials) => {
		const response = await api.post("/user/login", credentials);
		return response.data;
	},

	
	adminLogin: async (credentials) => {
		const response = await api.post("/user/adminlogin", credentials);
		return response.data;
	},

	
	logout: async () => {
		const response = await api.post("/user/logout");
		return response.data;
	},

	
	verifyOTP: async (email, otp) => {
		const response = await api.post("/user/verifyOTP", { email, otp });
		return response.data;
	},

	
	resendOTP: async (email) => {
		const response = await api.post("/user/resendOTP", { email });
		return response.data;
	},

	
	refreshToken: async () => {
		const response = await api.post("/user/refreshToken");
		return response.data;
	},

	
	getProfile: async () => {
		const response = await api.get("/user/get-profile");
		return response.data;
	},

	
	updateProfile: async (profileData) => {
		const response = await api.put("/user/update-profile", profileData);
		return response.data;
	},

	
	changePassword: async (passwordData) => {
		const response = await api.post("/user/changePassword", passwordData);
		return response.data;
	},

	
	deleteAccount: async () => {
		const response = await api.delete("/user/deleteAccount");
		return response.data;
	},
};
