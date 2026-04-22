
import NodeCache from "node-cache";

const cache = new NodeCache({
	stdTTL: 300, 
	checkperiod: 60,
});

export const getCache = (key) => cache.get(key);

export const setCache = (key, value, ttl) => {
	return cache.set(key, value, ttl);
};

export const deleteCache = (key) => cache.del(key);

export const flushCache = () => cache.flushAll();
