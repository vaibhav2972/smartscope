
import React from "react";
import { useRFM } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import Badge from "../common/Badge";
import LoadingSpinner from "../common/LoadingSpinner";

const RFMAnalysis = () => {
	const { rfm, loading, error } = useRFM();

	const getSegmentColor = (segment) => {
		const colors = {
			Champions: "bg-purple-500/10 text-purple-400 border-purple-500/30",
			"Loyal Customers": "bg-blue-500/10 text-blue-400 border-blue-500/30",
			"Recent Customers": "bg-green-500/10 text-green-400 border-green-500/30",
			"At Risk": "bg-orange-500/10 text-orange-400 border-orange-500/30",
			"Lost Customers": "bg-red-500/10 text-red-400 border-red-500/30",
			"Big Spenders": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
			"Potential Loyalists": "bg-teal-500/10 text-teal-400 border-teal-500/30",
		};
		return colors[segment] || "bg-gray-800 text-gray-300 border-gray-700";
	};

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">RFM Analysis</h1>
					<p className="mt-2 text-gray-400">
						Customer segmentation based on Recency, Frequency, and Monetary
						value
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

				{!loading && !error && rfm && (
					<div className="space-y-6">
						
						<Card title="Overview" className="bg-gray-900 border-gray-800">
							<div className="text-3xl font-bold text-white">
								{rfm.total_users || 0} users analyzed
							</div>
						</Card>

						
						<Card title="What is RFM?" className="bg-gray-900 border-gray-800">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
									<h4 className="font-semibold text-blue-400 mb-2">
										📅 Recency
									</h4>
									<p className="text-sm text-gray-400">
										How recently did the user interact? Lower days = better
									</p>
								</div>

								<div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
									<h4 className="font-semibold text-green-400 mb-2">
										🔄 Frequency
									</h4>
									<p className="text-sm text-gray-400">
										How often does the user engage? More sessions = better
									</p>
								</div>

								<div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
									<h4 className="font-semibold text-purple-400 mb-2">
										💰 Monetary
									</h4>
									<p className="text-sm text-gray-400">
										How valuable is the user? More conversions = better
									</p>
								</div>
							</div>
						</Card>

						
						<Card
							title="Segment Summary"
							className="bg-gray-900 border-gray-800"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{rfm.segment_summary?.map((seg) => (
									<div
										key={seg.segment}
										className={`p-5 rounded-lg border ${getSegmentColor(seg.segment)}`}
									>
										<div className="flex justify-between items-start mb-3">
											<h4 className="font-bold text-lg text-white">
												{seg.segment}
											</h4>
											<span className="text-2xl font-bold text-white">
												{seg.count}
											</span>
										</div>

										{seg.interpretation && (
											<p className="text-sm text-gray-400 mb-3">
												{seg.interpretation}
											</p>
										)}

										<div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
											<div>
												<div>Avg Recency</div>
												<div className="font-semibold text-white">
													{seg.avg_recency?.toFixed(0)}d
												</div>
											</div>
											<div>
												<div>Avg Frequency</div>
												<div className="font-semibold text-white">
													{seg.avg_frequency?.toFixed(0)}
												</div>
											</div>
											<div>
												<div>Avg Monetary</div>
												<div className="font-semibold text-white">
													{seg.avg_monetary?.toFixed(0)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</Card>

						
						<Card title="All Users" className="bg-gray-900 border-gray-800">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-800">
										<tr>
											{[
												"User ID",
												"Segment",
												"RFM Score",
												"R",
												"F",
												"M",
												"Total Score",
											].map((h) => (
												<th
													key={h}
													className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
												>
													{h}
												</th>
											))}
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-800">
										{rfm.users?.slice(0, 20).map((user) => (
											<tr
												key={user.userId}
												className="hover:bg-gray-800/60 transition-colors"
											>
												<td className="px-6 py-4 text-sm font-medium text-white">
													{user.userId}
												</td>

												<td className="px-6 py-4">
													<span
														className={`px-3 py-1 text-xs font-semibold rounded-full border ${getSegmentColor(
															user.segment,
														)}`}
													>
														{user.segment}
													</span>
												</td>

												<td className="px-6 py-4 text-sm font-mono font-bold text-white">
													{user.rfm_score}
												</td>

												
												<td className="px-6 py-4">
													<div className="flex gap-1">
														{[...Array(5)].map((_, i) => (
															<div
																key={i}
																className={`w-2 h-6 rounded ${
																	i < user.r_score
																		? "bg-blue-500"
																		: "bg-gray-700"
																}`}
															/>
														))}
													</div>
												</td>

												
												<td className="px-6 py-4">
													<div className="flex gap-1">
														{[...Array(5)].map((_, i) => (
															<div
																key={i}
																className={`w-2 h-6 rounded ${
																	i < user.f_score
																		? "bg-green-500"
																		: "bg-gray-700"
																}`}
															/>
														))}
													</div>
												</td>

												
												<td className="px-6 py-4">
													<div className="flex gap-1">
														{[...Array(5)].map((_, i) => (
															<div
																key={i}
																className={`w-2 h-6 rounded ${
																	i < user.m_score
																		? "bg-purple-500"
																		: "bg-gray-700"
																}`}
															/>
														))}
													</div>
												</td>

												<td className="px-6 py-4 text-sm font-bold text-white">
													{user.rfm_total}/15
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default RFMAnalysis;
