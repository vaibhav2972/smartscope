import { useState, useEffect } from "react";
import { websiteService } from "@/services/websiteService";

export const useWebsites = () => {
	const [websites, setWebsites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchWebsites();
	}, []);

	const fetchWebsites = async () => {
		try {
			setLoading(true);
			const response = await websiteService.getAllWebsites();
			setWebsites(response.data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return { websites, loading, error, refetch: fetchWebsites };
};
