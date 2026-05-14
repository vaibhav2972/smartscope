

import React from "react";
import { useEngagement } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import BarChart from "../charts/BarChart";
import LoadingSpinner from "../common/LoadingSpinner";

const EngagementLeaderboard = () => {
	const { engagement, loading, error } = useEngagement();

	const getGradeBadge = (grade) => {
		const variants = {
			A: "bg-green-500/20 text-green-400",
			B: "bg-blue-500/20 text-blue-400",
			C: "bg-yellow-500/20 text-yellow-400",
			D: "bg-orange-500/20 text-orange-400",
			F: "bg-red-500/20 text-red-400",
		};
		return variants[grade] || variants["F"];
	};

	const chartData = engagement?.leaderboard
		? {
				labels: engagement.leaderboard.slice(0, 10).map((u, i) => `#${i + 1}`),
				datasets: [
					{
						label: "Engagement Score",
						data: engagement.leaderboard.slice(0, 10).map((u) => u.score),
						backgroundColor: "#3B82F6",
						borderRadius: 8,
					},
				],
			}
		: null;

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-6xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">
						Engagement Leaderboard
					</h1>
					<p className="mt-2 text-gray-400">
						Top users ranked by engagement score
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

				{!loading && !error && engagement && (
					<div className="space-y-6">
						
						{engagement.distribution && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								{[
									{
										label: "Total Users",
										value: engagement.distribution.total_users,
									},
									{
										label: "Average Score",
										value: engagement.distribution.average_score?.toFixed(1),
									},
									{
										label: "Median Score",
										value: engagement.distribution.median_score?.toFixed(1),
									},
									{
										label: "Top Score",
										value: engagement.distribution.max_score?.toFixed(1),
									},
								].map((stat, i) => (
									<Card key={i} className="bg-gray-900 border-gray-800">
										<div className="text-sm text-gray-400 mb-1">
											{stat.label}
										</div>
										<div className="text-3xl font-bold text-white">
											{stat.value}
										</div>
									</Card>
								))}
							</div>
						)}

						
						<Card title="Top 10 Users" className="bg-gray-900 border-gray-800">
							{chartData && <BarChart data={chartData} />}
						</Card>

						
						<Card
							title="Full Leaderboard"
							className="bg-gray-900 border-gray-800"
						>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-800">
										<tr>
											{[
												"Rank",
												"User ID",
												"Score",
												"Grade",
												"Percentile",
												"Level",
											].map((h) => (
												<th
													key={h}
													className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
												>
													{h}
												</th>
											))}
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-800">
										{engagement.leaderboard?.map((user, index) => (
											<tr
												key={user.user_id}
												className="hover:bg-gray-800/60 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													{index < 3 ? (
														<div
															className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
																index === 0
																	? "bg-yellow-500"
																	: index === 1
																		? "bg-gray-400"
																		: "bg-orange-600"
															}`}
														>
															{user.rank}
														</div>
													) : (
														<div className="text-gray-300 font-semibold">
															#{user.rank}
														</div>
													)}
												</td>

												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-white">
														{user.user_id}
													</div>
												</td>

												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-bold text-white">
														{user.score?.toFixed(2)}
													</div>
												</td>

												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getGradeBadge(
															user.grade,
														)}`}
													>
														{user.grade}
													</span>
												</td>

												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
													{user.percentile?.toFixed(1)}%
												</td>

												<td className="px-6 py-4 whitespace-nowrap">
													<span className="text-sm text-gray-300">
														{user.level || user.interpretation || "-"}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>

						
						{engagement.distribution?.grade_distribution && (
							<Card
								title="Grade Distribution"
								className="bg-gray-900 border-gray-800"
							>
								<div className="grid grid-cols-5 gap-4">
									{Object.entries(
										engagement.distribution.grade_distribution,
									).map(([grade, count]) => (
										<div
											key={grade}
											className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700"
										>
											<div
												className={`text-3xl font-bold mb-2 ${
													grade === "A"
														? "text-green-400"
														: grade === "B"
															? "text-blue-400"
															: grade === "C"
																? "text-yellow-400"
																: grade === "D"
																	? "text-orange-400"
																	: "text-red-400"
												}`}
											>
												{grade}
											</div>
											<div className="text-2xl font-bold text-white">
												{count}
											</div>
											<div className="text-sm text-gray-400">users</div>
										</div>
									))}
								</div>
							</Card>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default EngagementLeaderboard;
