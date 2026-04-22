export const formatUserDataForBehaviorML = (sessions = []) => {
	if (!sessions.length) return null;

	return {
		sessions: sessions.map((s) => ({
			duration: s.duration || 0,
			interactions: s.totalInteractions || 0,
			conversions: s.hasConversion ? 1 : 0,
			bounceRate: s.bounceRate ? 1 : 0,
			page: s.exitPage || "unknown",
		})),
		days_active: sessions.length,
		avg_session_gap: calculateAvgSessionGap(sessions),
	};
};

const calculateAvgSessionGap = (sessions) => {
	if (sessions.length < 2) return 0;

	const sorted = sessions.sort(
		(a, b) => new Date(a.sessionStart) - new Date(b.sessionStart),
	);

	let totalGap = 0;

	for (let i = 1; i < sorted.length; i++) {
		const prev = new Date(sorted[i - 1].sessionStart);
		const curr = new Date(sorted[i].sessionStart);

		totalGap += (curr - prev) / (1000 * 60 * 60 * 24); 
	}

	return totalGap / (sessions.length - 1);
};
