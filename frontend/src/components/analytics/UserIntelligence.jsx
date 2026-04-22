

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserIntelligence } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import Badge from "../common/Badge";
import LoadingSpinner from "../common/LoadingSpinner";

const UserIntelligence = () => {
	const { userId } = useParams();
	const [selectedUserId, setSelectedUserId] = useState(userId || "");
	const [activeUserId, setActiveUserId] = useState(userId || "");

	const { intelligence, loading, error, refetch } =
		useUserIntelligence(activeUserId);

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

	return (
		<div className="bg-gray-950 p-6 min-h-screen">
			<div className="max-w-6xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">
						User Intelligence Profile
					</h1>
					<p className="mt-2 text-gray-400">
						Complete behavioral analysis powered by ML
					</p>
				</div>

				
				<Card className="mb-6 bg-gray-900 border-gray-800">
					<form onSubmit={handleSearch} className="flex gap-4">
						<input
							type="text"
							value={selectedUserId}
							onChange={(e) => setSelectedUserId(e.target.value)}
							placeholder="Enter User ID"
							className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
						/>
						<button
							type="submit"
							className="px-6 py-2 bg-linear-to-r from-cyan-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
						>
							Analyze User
						</button>
					</form>
				</Card>

				{loading && <LoadingSpinner text="Analyzing user behavior..." />}

				{error && (
					<Card className="bg-gray-900 border-gray-800">
						<div className="text-center py-8">
							<p className="text-red-400 text-lg">{error}</p>
							<button
								onClick={refetch}
								className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
							>
								Retry
							</button>
						</div>
					</Card>
				)}

				{!loading && !error && intelligence?.success && (
					<div className="space-y-6">
						
						<Card title="User Summary" className="bg-gray-900 border-gray-800">
							<div className="space-y-4">
								<div className="p-4 bg-cyan-500/10 border-l-4 border-cyan-500 rounded-lg">
									<p className="text-lg text-white font-medium">
										{intelligence.summary}
									</p>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="text-center p-4 bg-gray-800 rounded-lg">
										<div className="text-sm text-gray-400 mb-1">User ID</div>
										<div className="font-semibold text-white">
											{intelligence.user_id.slice(-8)}
										</div>
									</div>
									<div className="text-center p-4 bg-gray-800 rounded-lg">
										<div className="text-sm text-gray-400 mb-1">Risk Level</div>
										<Badge
											variant={getRiskBadgeVariant(intelligence.risk?.level)}
										>
											{intelligence.risk?.level || "Unknown"}
										</Badge>
									</div>
									<div className="text-center p-4 bg-gray-800 rounded-lg">
										<div className="text-sm text-gray-400 mb-1">Engagement</div>
										<div
											className={`inline-block px-3 py-1 rounded-full font-medium ${getEngagementColor(intelligence.behavior?.engagement_level)}`}
										>
											{intelligence.behavior?.engagement_level || "Unknown"}
										</div>
									</div>
									<div className="text-center p-4 bg-gray-800 rounded-lg">
										<div className="text-sm text-gray-400 mb-1">User Type</div>
										<div className="font-semibold text-white">
											{intelligence.behavior?.user_type || "Unknown"}
										</div>
									</div>
								</div>
							</div>
						</Card>

						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Card title="Key Metrics" className="bg-gray-900 border-gray-800">
								<div className="space-y-4">
									<div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
										<span className="text-gray-400">Total Sessions</span>
										<span className="font-semibold text-white">
											{intelligence.metrics?.total_sessions || 0}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
										<span className="text-gray-400">Days Since Last Visit</span>
										<span className="font-semibold text-white">
											{intelligence.metrics?.days_since_last_visit || 0}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
										<span className="text-gray-400">Avg Session Time</span>
										<span className="font-semibold text-white">
											{intelligence.metrics?.average_session_time ||
												"0 seconds"}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
										<span className="text-gray-400">Total Interactions</span>
										<span className="font-semibold text-white">
											{intelligence.metrics?.total_interactions || 0}
										</span>
									</div>
								</div>
							</Card>

							<Card
								title="Behavior Classification"
								className="bg-gray-900 border-gray-800"
							>
								<div className="space-y-4">
									<div>
										<div className="text-sm text-gray-400 mb-2">
											Activity Status
										</div>
										<div className="p-3 bg-gray-800 rounded-lg font-semibold text-white">
											{intelligence.behavior?.activity_status || "Unknown"}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-400 mb-2">User Type</div>
										<div className="p-3 bg-gray-800 rounded-lg font-semibold text-white">
											{intelligence.behavior?.user_type || "Unknown"}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-400 mb-2">
											Value Segment
										</div>
										<div className="p-3 bg-gray-800 rounded-lg font-semibold text-white">
											{intelligence.behavior?.value_segment || "Unknown"}
										</div>
									</div>
								</div>
							</Card>
						</div>

						
						<Card title="Key Insights" className="bg-gray-900 border-gray-800">
							<div className="space-y-3">
								{intelligence.insights?.map((insight, index) => (
									<div
										key={index}
										className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
									>
										<div className="w-6 h-6 rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
											{index + 1}
										</div>
										<p className="text-white flex-1">{insight}</p>
									</div>
								))}
							</div>
						</Card>

						
						<Card
							title="Risk Assessment"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
									<div>
										<div className="text-sm text-gray-400 mb-1">
											Churn Risk Level
										</div>
										<div className="font-semibold text-white">
											{intelligence.risk?.level || "Unknown"}
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-400 mb-1">
											Probability
										</div>
										<div className="text-2xl font-bold text-white">
											{(
												(intelligence.risk?.churn_probability || 0) * 100
											).toFixed(0)}
											%
										</div>
									</div>
								</div>
								<div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-lg">
									<p className="text-white">
										{intelligence.risk?.status || "No status available"}
									</p>
								</div>
							</div>
						</Card>

						
						<Card
							title="Recommended Actions"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-3">
								{intelligence.recommendations?.map((rec, index) => (
									<div
										key={index}
										className="flex items-start gap-3 p-4 bg-green-500/10 border-l-4 border-green-500 rounded-lg"
									>
										<div className="text-green-400 text-xl shrink-0">
											✓
										</div>
										<p className="text-white flex-1">{rec}</p>
									</div>
								))}
							</div>
						</Card>
					</div>
				)}

				{!loading && !error && !intelligence && activeUserId && (
					<Card className="bg-gray-900 border-gray-800">
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🔍</div>
							<p className="text-xl text-gray-400 mb-2">No data found</p>
							<p className="text-gray-500">
								User ID may not exist or has no activity
							</p>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

export default UserIntelligence;
