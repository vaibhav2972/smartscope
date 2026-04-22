
import React, { useState } from "react";
import { useLifecycle } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";

const UserLifecycle = () => {
	const { lifecycle, loading, error } = useLifecycle();
	const [selectedStage, setSelectedStage] = useState("all");

	const getStageColor = (stage) => {
		const colors = {
			"New User": "bg-blue-500/10 text-blue-400 border-blue-500/30",
			"Active User": "bg-green-500/10 text-green-400 border-green-500/30",
			"Power User": "bg-purple-500/10 text-purple-400 border-purple-500/30",
			"Declining User": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
			"At Risk": "bg-orange-500/10 text-orange-400 border-orange-500/30",
			Churned: "bg-red-500/10 text-red-400 border-red-500/30",
			"Casual User": "bg-gray-800 text-gray-300 border-gray-700",
		};
		return colors[stage] || colors["Casual User"];
	};

	const getTrendIcon = (trend) => {
		const icons = {
			Growing: "📈",
			Stable: "➡️",
			Declining: "📉",
			Onboarding: "🆕",
		};
		return icons[trend] || "•";
	};

	const filteredUsers =
		lifecycle?.users?.filter((user) => {
			if (selectedStage === "all") return true;
			return user.lifecycle_stage === selectedStage;
		}) || [];

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">
						User Lifecycle Stages
					</h1>
					<p className="mt-2 text-gray-400">
						Track users through their journey from new to power user or churn
					</p>
				</div>

				{loading && <LoadingSpinner />}

				{error && (
					<Card className="bg-gray-900 border-gray-800">
						<div className="text-center py-8">
							<p className="text-red-400">{error}</p>
						</div>
					</Card>
				)}

				{!loading && !error && lifecycle && (
					<div className="space-y-6">
						
						<Card title="Overview" className="bg-gray-900 border-gray-800">
							<div className="text-3xl font-bold text-white mb-4">
								{lifecycle.total_users || 0} users analyzed
							</div>

							
							{lifecycle.stage_distribution && (
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
									{Object.entries(lifecycle.stage_distribution).map(
										([stage, count]) => (
											<div
												key={stage}
												onClick={() =>
													setSelectedStage(
														selectedStage === stage ? "all" : stage,
													)
												}
												className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
													selectedStage === stage
														? getStageColor(stage)
														: "bg-gray-800 border-gray-700 hover:border-gray-600"
												}`}
											>
												<div className="text-2xl font-bold text-white">
													{count}
												</div>
												<div className="text-xs mt-1 text-gray-400">
													{stage}
												</div>
											</div>
										),
									)}
								</div>
							)}
						</Card>

						
						<Card
							title="User Journey Funnel"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-2">
								{[
									{ stage: "New User", icon: "🆕", desc: "Just started" },
									{
										stage: "Active User",
										icon: "✨",
										desc: "Regular engagement",
									},
									{ stage: "Power User", icon: "⭐", desc: "Highly engaged" },
									{
										stage: "Declining User",
										icon: "⚠️",
										desc: "Engagement dropping",
									},
									{ stage: "At Risk", icon: "🚨", desc: "Likely to leave" },
									{ stage: "Churned", icon: "❌", desc: "Left the platform" },
								].map((item) => {
									const count = lifecycle.stage_distribution?.[item.stage] || 0;
									const total = lifecycle.total_users || 1;
									const percentage = ((count / total) * 100).toFixed(1);

									return (
										<div
											key={item.stage}
											className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
										>
											<div className="text-3xl">{item.icon}</div>

											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-semibold text-white">
														{item.stage}
													</span>
													<span className="text-sm text-gray-400">
														• {item.desc}
													</span>
												</div>

												<div className="w-full bg-gray-700 rounded-full h-2">
													<div
														className="bg-cyan-500 h-2 rounded-full"
														style={{ width: `${percentage}%` }}
													/>
												</div>
											</div>

											<div className="text-right">
												<div className="text-2xl font-bold text-white">
													{count}
												</div>
												<div className="text-xs text-gray-400">
													{percentage}%
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</Card>

						
						<Card className="bg-gray-900 border-gray-800">
							<div className="flex gap-2 flex-wrap">
								<button
									onClick={() => setSelectedStage("all")}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										selectedStage === "all"
											? "bg-cyan-500 text-white"
											: "bg-gray-800 text-gray-300 hover:bg-gray-700"
									}`}
								>
									All Users ({lifecycle.total_users})
								</button>

								{Object.keys(lifecycle.stage_distribution || {}).map(
									(stage) => (
										<button
											key={stage}
											onClick={() => setSelectedStage(stage)}
											className={`px-4 py-2 rounded-lg font-medium transition-colors ${
												selectedStage === stage
													? getStageColor(stage)
													: "bg-gray-800 text-gray-300 hover:bg-gray-700"
											}`}
										>
											{stage} ({lifecycle.stage_distribution[stage]})
										</button>
									),
								)}
							</div>
						</Card>

						
						<Card
							title={
								selectedStage === "all" ? "All Users" : `${selectedStage} Users`
							}
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-3">
								{filteredUsers.map((user) => (
									<div
										key={user.user_id}
										className={`p-4 rounded-lg border ${getStageColor(
											user.lifecycle_stage,
										)}`}
									>
										<div className="flex flex-col md:flex-row md:justify-between gap-3">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<span className="font-semibold text-white">
														User {user.user_id.slice(-8)}
													</span>
													<span className="text-sm text-gray-300">
														{getTrendIcon(user.engagement_trend)}{" "}
														{user.engagement_trend}
													</span>
												</div>

												{user.interpretation && (
													<p className="text-sm text-gray-400 mb-2">
														{user.interpretation}
													</p>
												)}

												<div className="text-sm bg-gray-800/60 text-gray-300 p-2 rounded">
													💡 {user.recommended_action}
												</div>
											</div>

											<div className="flex gap-4">
												{[
													{
														label: "Days Since Signup",
														value: user.days_since_signup || 0,
													},
													{
														label: "Last Active",
														value: `${user.days_since_last_session}d`,
													},
													{ label: "Sessions", value: user.total_sessions },
												].map((stat, i) => (
													<div key={i} className="text-center">
														<div className="text-xs text-gray-400">
															{stat.label}
														</div>
														<div className="text-lg font-bold text-white">
															{stat.value}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}

								{filteredUsers.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										No users in this stage
									</div>
								)}
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserLifecycle;
