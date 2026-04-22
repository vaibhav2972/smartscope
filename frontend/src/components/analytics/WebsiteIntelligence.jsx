
import React, { useState, useEffect } from "react";
import { useWebsiteIntelligence } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";

const WebsiteIntelligence = () => {
	const [refreshKey, setRefreshKey] = useState(0);

	const { data, loading, error, refetch } = useWebsiteIntelligence();

	useEffect(() => {
		refetch();
	}, [refreshKey]);

	const handleRefresh = () => {
		setRefreshKey((prev) => prev + 1);
	};

	const getStatusTag = (index, total) => {
		if (index === 0)
			return "bg-green-600 text-white border border-emerald-500/20";
		if (index === total - 1)
			return "bg-red-600 text-white border border-red-500/20";
		return "bg-yellow-600 text-white border border-gray-700";
	};

	const getStatusLabel = (index, total) => {
		if (index === 0) return "Leading";
		if (index === total - 1) return "Needs Attention";
		return "Stable";
	};

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8 flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold text-white">
							Website Intelligence
						</h1>
						<p className="text-gray-400 mt-2">
							Cross-platform behavioral performance comparison
						</p>
					</div>

					<button
						onClick={handleRefresh}
						className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-200 rounded-lg hover:bg-gray-800 transition"
					>
						Refresh
					</button>
				</div>

				
				{loading && (
					<LoadingSpinner text="Analyzing platform behavior patterns..." />
				)}

				
				{error && (
					<Card className="bg-gray-900 border-gray-800 text-red-400 text-center">
						{error}
					</Card>
				)}

				
				{data?.success && (
					<div className="space-y-6">
						
						<Card className="bg-gray-900 border-gray-800">
							<div className="p-5 border-l-4 border-cyan-500/40">
								<p className="text-white text-lg font-semibold">
									{data.summary?.action}
								</p>
								<p className="text-gray-400 text-sm mt-2">
									{data.summary?.key_difference}
								</p>
							</div>
						</Card>

						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="bg-gray-900 border-2 border-green-800">
								<div className="text-sm text-gray-500">
									Best Performing Platform
								</div>
								<div className="text-white font-semibold mt-1">
									{data.summary?.best_performing_site}
								</div>
							</Card>

							<Card className="bg-gray-900 border-2 border-red-800">
								<div className="text-sm text-gray-500">
									Worst Performing Platform
								</div>
								<div className="text-white font-semibold mt-1">
									{data.summary?.worst_performing_site}
								</div>
							</Card>

							<Card className="bg-gray-900 border border-gray-800">
								<div className="text-sm text-gray-500">Platforms Analyzed</div>
								<div className="text-white font-semibold mt-1">
									{data.rankings?.length || 0}
								</div>
							</Card>
						</div>

						
						<Card
							title="Platform Ranking"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-4">
								{data.rankings?.map((site, index) => (
									<div
										key={site.website_id}
										className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800/40 transition"
									>
										
										<div className="flex justify-between items-center mb-4">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 font-bold">
													{index + 1}
												</div>

												<div className="text-white font-semibold">
													{site.website_name}
												</div>
											</div>

											
											<span
												className={`px-3 py-1 text-xs rounded-full ${getStatusTag(
													index,
													data.rankings.length,
												)}`}
											>
												{getStatusLabel(index, data.rankings.length)}
											</span>
										</div>

										
										<div className="space-y-2">
											{site.insights?.map((insight, i) => (
												<div
													key={i}
													className="flex items-start gap-2 text-gray-300"
												>
													
													<span className="text-sm">• {insight}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</Card>

						
						<Card className="bg-gray-900 border-gray-800">
							<div className="text-gray-500 text-sm">
								Insights are generated from aggregated behavioral signals across
								platforms.
							</div>
						</Card>
					</div>
				)}

				
				{!loading && !data && (
					<Card className="bg-gray-900 border-gray-800 text-center text-gray-500">
						No website intelligence data available
					</Card>
				)}
			</div>
		</div>
	);
};

export default WebsiteIntelligence;
