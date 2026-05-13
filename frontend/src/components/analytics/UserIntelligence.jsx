import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserIntelligence } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import Badge from "../common/Badge";

const UserIntelligence = () => {
	const { userId } = useParams();

	const [selectedUserId, setSelectedUserId] = useState(userId || "");
	const [activeUserId, setActiveUserId] = useState(userId || "");

	const { intelligence, loading, error, refetch } =
		useUserIntelligence(activeUserId);

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 300000);

		return () => clearInterval(interval);
	}, [refetch]);

	const handleSearch = (e) => {
		e.preventDefault();

		if (selectedUserId.trim()) {
			setActiveUserId(selectedUserId);
		}
	};

	const getRiskBadgeVariant = (level) => {
		switch (level?.toLowerCase()) {
			case "high":
				return "danger";
			case "medium":
				return "warning";
			case "low":
				return "success";
			default:
				return "default";
		}
	};

	const getEngagementColor = (level) => {
		switch (level?.toLowerCase()) {
			case "very high":
				return "text-green-400 bg-green-500/10 border border-green-500/30";

			case "high":
				return "text-blue-400 bg-blue-500/10 border border-blue-500/30";

			case "medium":
				return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30";

			case "low":
				return "text-orange-400 bg-orange-500/10 border border-orange-500/30";

			case "very low":
				return "text-red-400 bg-red-500/10 border border-red-500/30";

			default:
				return "text-gray-400 bg-gray-500/10 border border-gray-500/30";
		}
	};

	const getTrendColor = (trend) => {
		switch (trend?.toLowerCase()) {
			case "declining":
				return "bg-red-500/10 text-red-400 border border-red-500/30";

			case "growing":
				return "bg-green-500/10 text-green-400 border border-green-500/30";

			default:
				return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
		}
	};

	const getOverallStatus = () => {
		const churn = intelligence?.risk?.churn_probability || 0;

		if (churn > 0.7) return "Critical";
		if (churn > 0.4) return "Warning";

		return "Stable";
	};

	const getRecommendationPriority = (text) => {
		const lower = text.toLowerCase();

		if (lower.includes("re-engagement")) {
			return {
				label: "High Priority",
				className: "bg-red-500/10 border-red-500 text-red-400",
			};
		}

		if (lower.includes("onboarding")) {
			return {
				label: "Medium Priority",
				className: "bg-yellow-500/10 border-yellow-500 text-yellow-400",
			};
		}

		return {
			label: "Low Priority",
			className: "bg-green-500/10 border-green-500 text-green-400",
		};
	};

	const renderSkeleton = () => (
		<div className="space-y-6 animate-pulse">
			<div className="h-40 bg-gray-800 rounded-2xl"></div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="h-64 bg-gray-800 rounded-2xl"></div>
				<div className="h-64 bg-gray-800 rounded-2xl"></div>
			</div>

			<div className="h-72 bg-gray-800 rounded-2xl"></div>
		</div>
	);

	return (
		<div className="bg-gray-950 min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				{/* HEADER */}

				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-4xl font-bold text-white">
							User Intelligence Dashboard
						</h1>

						<p className="text-gray-400 mt-2">
							AI-powered behavioral analytics & retention insights
						</p>
					</div>

					<div className="text-sm text-gray-500">
						Last updated: {new Date().toLocaleString()}
					</div>
				</div>

				{/* SEARCH */}

				<Card className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl">
					<form
						onSubmit={handleSearch}
						className="flex flex-col md:flex-row gap-4"
					>
						<input
							type="text"
							value={selectedUserId}
							onChange={(e) => setSelectedUserId(e.target.value)}
							placeholder="Enter User ID"
							className="flex-1 px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						/>

						<button
							type="submit"
							className="px-8 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all"
						>
							Analyze User
						</button>
					</form>
				</Card>

				{/* LOADING */}

				{loading && renderSkeleton()}

				{/* ERROR */}

				{error && (
					<Card className="bg-gray-900 border border-red-500/20 rounded-2xl">
						<div className="text-center py-12">
							<div className="text-5xl mb-4">⚠️</div>

							<p className="text-red-400 text-xl font-semibold">{error}</p>

							<button
								onClick={refetch}
								className="mt-6 px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all"
							>
								Retry
							</button>
						</div>
					</Card>
				)}

				{/* DATA */}

				{!loading && !error && intelligence?.success && (
					<div className="space-y-8">
						{/* SUMMARY */}

						<Card className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
							<div className="p-6 border-b border-gray-800">
								<h2 className="text-2xl font-bold text-white">User Summary</h2>
							</div>

							<div className="p-6">
								<div className="p-5 bg-cyan-500/10 border-l-4 border-cyan-500 rounded-xl mb-6">
									<p className="text-lg text-white font-medium">
										{intelligence?.summary || "No summary available"}
									</p>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
									<div className="bg-gray-800 rounded-xl p-5 text-center">
										<div className="text-sm text-gray-400 mb-2">User ID</div>

										<div className="text-white font-bold">
											{intelligence?.user_id?.slice(-8) || "N/A"}
										</div>
									</div>

									<div className="bg-gray-800 rounded-xl p-5 text-center">
										<div className="text-sm text-gray-400 mb-2">Risk Level</div>

										<Badge
											variant={getRiskBadgeVariant(intelligence?.risk?.level)}
										>
											{intelligence?.risk?.level || "Unknown"}
										</Badge>
									</div>

									<div className="bg-gray-800 rounded-xl p-5 text-center">
										<div className="text-sm text-gray-400 mb-2">Engagement</div>

										<div
											className={`inline-block px-4 py-2 rounded-full font-medium ${getEngagementColor(
												intelligence?.behavior?.engagement_level,
											)}`}
										>
											{intelligence?.behavior?.engagement_level || "Unknown"}
										</div>
									</div>

									<div className="bg-gray-800 rounded-xl p-5 text-center">
										<div className="text-sm text-gray-400 mb-2">Status</div>

										<div className="font-bold text-white">
											{getOverallStatus()}
										</div>
									</div>

									<div className="bg-gray-800 rounded-xl p-5 text-center">
										<div className="text-sm text-gray-400 mb-2">User Type</div>

										<div className="font-bold text-white">
											{intelligence?.behavior?.user_type || "Unknown"}
										</div>
									</div>
								</div>
							</div>
						</Card>

						{/* KPI GRID */}

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* METRICS */}

							<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
								<div className="p-6">
									<h2 className="text-xl font-bold text-white mb-6">
										Key Metrics
									</h2>

									<div className="space-y-4">
										{[
											{
												label: "Total Sessions",
												value: intelligence?.metrics?.total_sessions || 0,
											},
											{
												label: "Days Since Last Visit",
												value:
													intelligence?.metrics?.days_since_last_visit || 0,
											},
											{
												label: "Avg Session Time",
												value:
													intelligence?.metrics?.average_session_time ||
													"0 sec",
											},
											{
												label: "Total Interactions",
												value: intelligence?.metrics?.total_interactions || 0,
											},
										].map((item, index) => (
											<div
												key={index}
												className="flex justify-between items-center bg-gray-800 rounded-xl p-4"
											>
												<span className="text-gray-400">{item.label}</span>

												<span className="font-bold text-white">
													{item.value}
												</span>
											</div>
										))}
									</div>
								</div>
							</Card>

							{/* ENGAGEMENT */}

							<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
								<div className="p-6">
									<h2 className="text-xl font-bold text-white mb-6">
										Engagement Score
									</h2>

									<div className="text-center">
										<div className="text-6xl font-bold text-cyan-400">
											{intelligence?.model_details?.engagement?.score?.toFixed(
												1,
											) || "0"}
										</div>

										<div className="mt-3 text-gray-400">
											Grade: {intelligence?.model_details?.engagement?.grade}
										</div>

										<div className="mt-6 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
											<div
												className="h-4 rounded-full bg-linear-to-r from-cyan-500 to-indigo-500"
												style={{
													width: `${
														(intelligence?.model_details?.engagement?.score ||
															0) * 10
													}%`,
												}}
											/>
										</div>

										<div className="mt-4 text-sm text-gray-500">
											Rank #{intelligence?.model_details?.engagement?.rank}
										</div>
									</div>
								</div>
							</Card>

							{/* TREND */}

							<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
								<div className="p-6">
									<h2 className="text-xl font-bold text-white mb-6">
										Lifecycle Trend
									</h2>

									<div className="space-y-5">
										<div>
											<div className="text-sm text-gray-400 mb-2">
												Current Stage
											</div>

											<div className="bg-gray-800 rounded-xl p-4 text-white font-semibold">
												{intelligence?.model_details?.lifecycle?.stage}
											</div>
										</div>

										<div>
											<div className="text-sm text-gray-400 mb-2">Trend</div>

											<div
												className={`rounded-xl px-4 py-3 font-semibold ${getTrendColor(
													intelligence?.model_details?.lifecycle?.trend,
												)}`}
											>
												{intelligence?.model_details?.lifecycle?.trend}
											</div>
										</div>

										<div>
											<div className="text-sm text-gray-400 mb-2">
												RFM Segment
											</div>

											<div className="bg-gray-800 rounded-xl p-4 text-white font-semibold">
												{intelligence?.model_details?.rfm?.segment}
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>

						{/* RISK */}

						<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
							<div className="p-6">
								<h2 className="text-2xl font-bold text-white mb-6">
									Risk Assessment
								</h2>

								<div className="space-y-6">
									<div className="bg-gray-800 rounded-2xl p-6">
										<div className="flex justify-between mb-3">
											<span className="text-gray-400">Churn Probability</span>

											<span className="text-white font-bold">
												{(
													(intelligence?.risk?.churn_probability || 0) * 100
												).toFixed(0)}
												%
											</span>
										</div>

										<div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all duration-700 ${
													intelligence?.risk?.churn_probability > 0.7
														? "bg-red-500"
														: intelligence?.risk?.churn_probability > 0.4
															? "bg-yellow-500"
															: "bg-green-500"
												}`}
												style={{
													width: `${
														(intelligence?.risk?.churn_probability || 0) * 100
													}%`,
												}}
											/>
										</div>
									</div>

									<div className="bg-yellow-500/10 border-l-4 border-yellow-500 rounded-xl p-5">
										<p className="text-white">{intelligence?.risk?.status}</p>
									</div>
								</div>
							</div>
						</Card>

						{/* INSIGHTS */}

						<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
							<div className="p-6">
								<h2 className="text-2xl font-bold text-white mb-6">
									Key Insights
								</h2>

								<div className="space-y-4">
									{intelligence?.insights?.map((insight, index) => (
										<div
											key={index}
											className="flex items-start gap-4 bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-all"
										>
											<div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
												{index + 1}
											</div>

											<p className="text-white">{insight}</p>
										</div>
									))}
								</div>
							</div>
						</Card>

						{/* AI ACTION */}

						<Card className="bg-gray-900 border border-indigo-500/20 rounded-2xl">
							<div className="p-6">
								<h2 className="text-2xl font-bold text-white mb-6">
									AI Suggested Action
								</h2>

								<div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20">
									<h3 className="text-xl font-semibold text-white mb-3">
										Send Personalized Re-engagement Campaign
									</h3>

									<p className="text-gray-300 leading-relaxed">
										User inactivity has reached{" "}
										{intelligence?.metrics?.days_since_last_visit} days with a
										declining engagement trend. Recommend triggering a
										personalized retention campaign within the next 72 hours to
										improve recovery probability.
									</p>
								</div>
							</div>
						</Card>

						{/* RECOMMENDATIONS */}

						<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
							<div className="p-6">
								<h2 className="text-2xl font-bold text-white mb-6">
									Recommended Actions
								</h2>

								<div className="space-y-4">
									{intelligence?.recommendations?.map((rec, index) => {
										const priority = getRecommendationPriority(rec);

										return (
											<div
												key={index}
												className={`rounded-xl border-l-4 p-5 ${priority.className}`}
											>
												<div className="flex items-center justify-between mb-3">
													<div className="font-semibold">{priority.label}</div>

													<div className="text-xl">✓</div>
												</div>

												<p className="text-white">{rec}</p>
											</div>
										);
									})}
								</div>
							</div>
						</Card>
					</div>
				)}

				{/* EMPTY */}

				{!loading && !error && !intelligence && activeUserId && (
					<Card className="bg-gray-900 border border-gray-800 rounded-2xl">
						<div className="text-center py-16">
							<div className="text-7xl mb-6">🔍</div>

							<h2 className="text-2xl font-bold text-white mb-3">
								No Data Found
							</h2>

							<p className="text-gray-400 max-w-md mx-auto">
								Try searching with another valid User ID or verify whether the
								user has activity records available in the analytics system.
							</p>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

export default UserIntelligence;
