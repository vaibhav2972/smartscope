
import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";
const ML_TIMEOUT = parseInt(process.env.ML_SERVICE_TIMEOUT) || 30000;
const RETRY_ATTEMPTS = parseInt(process.env.ML_SERVICE_RETRY_ATTEMPTS) || 3;

class MLServiceClient {
	constructor() {
		this.baseURL = ML_SERVICE_URL;
		this.timeout = ML_TIMEOUT;
		this.retryAttempts = RETRY_ATTEMPTS;

		
		this.client = axios.create({
			baseURL: this.baseURL,
			timeout: this.timeout,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async request(method, endpoint, data = null, retries = this.retryAttempts) {
		try {
			const config = {
				method,
				url: endpoint,
			};

			if (data) {
				if (method.toLowerCase() === "get") {
					config.params = data;
				} else {
					config.data = data;
				}
			}

			const response = await this.client.request(config);
			return response.data;
		} catch (error) {
			
			if (retries > 0 && this.shouldRetry(error)) {
				console.log(
					`ML Service request failed, retrying... (${retries} attempts left)`,
				);
				await this.delay(1000);
				return this.request(method, endpoint, data, retries - 1);
			}

			throw this.handleError(error);
		}
	}


	shouldRetry(error) {
		if (!error.response) return true;

		const status = error.response.status;
		return status >= 500 && status < 600;
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	handleError(error) {
		if (!error.response) {
			return {
				success: false,
				error: "ML Service unavailable",
				message: "Cannot connect to ML service. Please ensure it is running.",
				mlServiceDown: true,
			};
		}

		return {
			success: false,
			error: error.response.data?.error || "ML Service error",
			message:
				error.response.data?.message || "An error occurred in ML service",
			status: error.response.status,
		};
	}


	async healthCheck() {
		try {
			const response = await this.request("GET", "/");
			return {
				success: true,
				status: "running",
				service: response.service,
				version: response.version,
			};
		} catch (error) {
			return {
				success: false,
				status: "down",
				error: error.message || "ML Service is not responding",
			};
		}
	}

	

	async getUserIntelligence(userId) {
		return this.request("GET", `/api/ml/user-intelligence/${userId}`);
	}

	

	async segmentUsers() {
		return this.request("POST", "/api/ml/segment-users");
	}

	async getUserSegment(userId) {
		return this.request("GET", `/api/ml/user-segment/${userId}`);
	}

	

	async calculateEngagementScores() {
		return this.request("POST", "/api/ml/engagement-score");
	}

	async getUserEngagementScore(userId) {
		return this.request("GET", `/api/ml/engagement-score/${userId}`);
	}

	

	async getRecommendations(userId, entityType = "product", topN = 5) {
		return this.request("POST", "/api/ml/recommend", {
			user_id: userId,
			entity_type: entityType,
			top_n: topN,
		});
	}

	async getSimilarUsers(userId, topN = 5, entityType = "product") {
		return this.request("GET", `/api/ml/similar-users/${userId}`, {
			top_n: topN,
			entity_type: entityType,
		});
	}

	

	async predictChurnRisk() {
		return this.request("POST", "/api/ml/churn-risk");
	}

	

	async performRFMAnalysis() {
		return this.request("POST", "/api/ml/rfm-analysis");
	}

	async getUserRFMSegment(userId) {
		return this.request("GET", `/api/ml/rfm-analysis/${userId}`);
	}

	

	async analyzeUserLifecycle() {
		return this.request("POST", "/api/ml/user-lifecycle");
	}
}


const mlServiceClient = new MLServiceClient();

export default mlServiceClient;
