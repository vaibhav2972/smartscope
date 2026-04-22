

import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export const useAnalytics = () => {
	const [overview, setOverview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchOverview = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getOverview();
			setOverview(data.overview);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOverview();
	}, [fetchOverview]);

	return { overview, loading, error, refetch: fetchOverview };
};

export const useUserIntelligence = (userId) => {
	const [intelligence, setIntelligence] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchIntelligence = useCallback(async () => {
		if (!userId) return;

		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getUserIntelligence(userId);
			setIntelligence(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchIntelligence();
	}, [fetchIntelligence]);

	return { intelligence, loading, error, refetch: fetchIntelligence };
};

export const useSegments = () => {
	const [segments, setSegments] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchSegments = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getUserSegments();
			setSegments(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSegments();
	}, [fetchSegments]);

	return { segments, loading, error, refetch: fetchSegments };
};

export const useEngagement = () => {
	const [engagement, setEngagement] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchEngagement = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getEngagementLeaderboard();
			setEngagement(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEngagement();
	}, [fetchEngagement]);

	return { engagement, loading, error, refetch: fetchEngagement };
};

export const useChurnRisk = () => {
	const [churnRisk, setChurnRisk] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchChurnRisk = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getChurnRisk();
			setChurnRisk(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchChurnRisk();
	}, [fetchChurnRisk]);

	return { churnRisk, loading, error, refetch: fetchChurnRisk };
};

export const useRFM = () => {
	const [rfm, setRfm] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchRFM = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getRFMAnalysis();
			setRfm(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRFM();
	}, [fetchRFM]);

	return { rfm, loading, error, refetch: fetchRFM };
};


export const useRecommendations = () => {
	const [recommendations, setRecommendations] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchRecommendations = useCallback(async (userId, params = {}) => {
		if (!userId) return;

		setLoading(true);
		setError(null);

		try {
			const data = await analyticsService.getRecommendations(userId, params);
			setRecommendations(data);
		} catch (err) {
			setError(err.message);
			setRecommendations(null);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		recommendations,
		loading,
		error,
		fetchRecommendations,
	};
};

export const useSimilarUsers = () => {
	const [similarUsers, setSimilarUsers] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchSimilarUsers = useCallback(async (userId, params = {}) => {
		if (!userId) return;

		setLoading(true);
		setError(null);

		try {
			const data = await analyticsService.getSimilarUsers(userId, params);
			setSimilarUsers(data);
		} catch (err) {
			setError(err.message);
			setSimilarUsers(null);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		similarUsers,
		loading,
		error,
		fetchSimilarUsers,
	};
};

export const useLifecycle = () => {
	const [lifecycle, setLifecycle] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchLifecycle = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyticsService.getLifecycleAnalysis();
			setLifecycle(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLifecycle();
	}, [fetchLifecycle]);

	return { lifecycle, loading, error, refetch: fetchLifecycle };
};

export const useBehaviorImportance = (userId) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchBehaviorImportance = useCallback(async () => {
		if (!userId) return;

		setLoading(true);
		setError(null);

		try {
			const res = await analyticsService.getBehaviorImportance(userId);
			setData(res);
		} catch (err) {
			setError(err.message);
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchBehaviorImportance();
	}, [fetchBehaviorImportance]);

	return {
		data,
		loading,
		error,
		refetch: fetchBehaviorImportance,
	};
};

export const useFeatureAttribution = (userId) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchFeatureAttribution = useCallback(async () => {
		if (!userId) return;

		setLoading(true);
		setError(null);

		try {
			const res = await analyticsService.getFeatureAttribution(userId);
			setData(res);
		} catch (err) {
			setError(err.message);
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchFeatureAttribution();
	}, [fetchFeatureAttribution]);

	return {
		data,
		loading,
		error,
		refetch: fetchFeatureAttribution,
	};
};

export const useWebsiteIntelligence = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchWebsiteIntelligence = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await analyticsService.getWebsiteIntelligence();
			setData(res);
		} catch (err) {
			setError(err.message);
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchWebsiteIntelligence();
	}, [fetchWebsiteIntelligence]);

	return {
		data,
		loading,
		error,
		refetch:fetchWebsiteIntelligence,
	};
};