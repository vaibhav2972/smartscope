

import React from "react";
import { useSegments } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import PieChart from "../charts/PieChart";
import LoadingSpinner from "../common/LoadingSpinner";

const UserSegments = () => {
	const { segments, loading, error } = useSegments();

	const segmentColors = {
		0: {
			bg: "bg-blue-500/10",
			text: "text-blue-400",
			border: "border-blue-500/30",
		},
		1: {
			bg: "bg-green-500/10",
			text: "text-green-400",
			border: "border-green-500/30",
		},
		2: {
			bg: "bg-amber-500/10",
			text: "text-amber-400",
			border: "border-amber-500/30",
		},
		3: {
			bg: "bg-red-500/10",
			text: "text-red-400",
			border: "border-red-500/30",
		},
	};

	const chartData = segments?.clusters
		? {
				labels: segments.clusters.map((c) => c.label),
				datasets: [
					{
						data: segments.clusters.map((c) => c.size),
						backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
						borderWidth: 0,
					},
				],
			}
		: null;

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">User Segments</h1>
					<p className="mt-2 text-gray-400">
						Behavioral groups identified by K-Means clustering
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

				{!loading && !error && segments && (
					<div className="space-y-6">
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="bg-gray-900 border-gray-800" title="Total Users">
								<div className="text-4xl font-bold text-white">
									{segments.total_users || 0}
								</div>
							</Card>

							<Card
								className="bg-gray-900 border-gray-800"
								title="Number of Segments"
							>
								<div className="text-4xl font-bold text-white">
									{segments.n_clusters || 0}
								</div>
							</Card>

							<Card
								className="bg-gray-900 border-gray-800"
								title="Clustering Algorithm"
							>
								<div className="text-2xl font-bold text-white">K-Means</div>
							</Card>
						</div>

						
						<Card
							title="Segment Distribution"
							className="bg-gray-900 border-gray-800"
						>
							{chartData && <PieChart data={chartData} />}
						</Card>

						
						<div className="grid grid-cols-1 gap-6">
							{segments.clusters?.map((cluster) => {
								const colors =
									segmentColors[cluster.cluster_id] || segmentColors[0];

								return (
									<Card
										key={cluster.cluster_id}
										className={`bg-gray-900 border-l-4 ${colors.border}`}
									>
										<div className="space-y-4">
											
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-2xl font-bold text-white">
														{cluster.label}
													</h3>
													{cluster.interpretation && (
														<p className="mt-1 text-gray-400">
															{cluster.interpretation}
														</p>
													)}
												</div>

												<div
													className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-bold`}
												>
													{cluster.size} users ({cluster.percentage}%)
												</div>
											</div>

											
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
												{[
													{
														label: "Avg Sessions",
														value: cluster.avg_sessions?.toFixed(1),
													},
													{
														label: "Avg Interactions",
														value: cluster.avg_interactions?.toFixed(0),
													},
													{
														label: "Avg Duration",
														value: `${cluster.avg_duration?.toFixed(0)}s`,
													},
													{
														label: "Bounce Rate",
														value: `${cluster.avg_bounce_rate?.toFixed(1)}%`,
													},
												].map((stat, i) => (
													<div
														key={i}
														className="p-4 bg-gray-800 rounded-lg border border-gray-700"
													>
														<div className="text-sm text-gray-400 mb-1">
															{stat.label}
														</div>
														<div className="text-xl font-bold text-white">
															{stat.value}
														</div>
													</div>
												))}
											</div>

											
											{cluster.sample_users &&
												cluster.sample_users.length > 0 && (
													<div>
														<div className="text-sm text-gray-400 mb-2">
															Sample Users:
														</div>

														<div className="flex flex-wrap gap-2">
															{cluster.sample_users.map((userId) => (
																<span
																	key={userId}
																	className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-medium`}
																>
																	{userId.slice(-8)}
																</span>
															))}
														</div>
													</div>
												)}
										</div>
									</Card>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserSegments;
