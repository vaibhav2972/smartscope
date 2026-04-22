
import { getCache, setCache } from "../utils/cache.js";

export const cacheMiddleware = (keyBuilder, defaultTTL = 300) => {
	return async (req, res, next) => {
		try {
			
			const key = keyBuilder(req);

			
			const ttl = parseInt(req.query.cacheTTL) || defaultTTL;

			
			const cached = getCache(key);
			if (cached) {
				return res.json({
					...cached,
					cached: true,
				});
			}

			
			const originalJson = res.json.bind(res);

			res.json = (body) => {
				
				if (body?.success !== false) {
					setCache(key, body, ttl);
				}
				return originalJson({
					...body,
					cached: false, 
				});
			};

			next();
		} catch (err) {
			next();
		}
	};
};
