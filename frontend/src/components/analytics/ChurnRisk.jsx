
import React, { useState } from "react";
import { useChurnRisk } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import Badge from "../common/Badge";
import PieChart from "../charts/PieChart";
import LoadingSpinner from "../common/LoadingSpinner";

const ChurnRisk = () => {
	const { churnRisk, loading, error } = useChurnRisk();
	const [filter, setFilter] = useState("all");

	const getRiskVariant = (level) => {
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

	const getRiskColor = (level) => {
		switch (level?.toLowerCase()) {
			case "high":
				return "text-red-400";
			case "medium":
				return "text-yellow-400";
			case "low":
				return "text-green-400";
			default:
				return "text-gray-400";
		}
	};

	const filteredPredictions =
		churnRisk?.predictions?.filter((pred) => {
			if (filter === "all") return true;
			return pred.risk_level?.toLowerCase() === filter;
		}) || [];

	const chartData = churnRisk
		? {
				labels: ["Low Risk", "Medium Risk", "High Risk"],
				datasets: [
					{
						data: [
							churnRisk.low_risk_count || 0,
							churnRisk.medium_risk_count || 0,
							churnRisk.high_risk_count || 0,
						],
						backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
						borderWidth: 0,
					},
				],
			}
		: null;

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">Churn Risk Analysis</h1>
					<p className="mt-2 text-gray-400">
						Users predicted to leave based on behavioral patterns
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

				{!loading && !error && churnRisk && (
					<div className="space-y-6">
						
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<Card className="bg-gray-900 border-gray-800">
								<div className="text-sm text-gray-400 mb-1">Total Users</div>
								<div className="text-3xl font-bold text-white">
									{churnRisk.total_users || 0}
								</div>
							</Card>

							<Card className="bg-gray-900 border-l-4 border-red-500">
								<div className="text-sm text-gray-400 mb-1">High Risk</div>
								<div className="text-3xl font-bold text-red-400">
									{churnRisk.high_risk_count || 0}
								</div>
							</Card>

							<Card className="bg-gray-900 border-l-4 border-yellow-500">
								<div className="text-sm text-gray-400 mb-1">Medium Risk</div>
								<div className="text-3xl font-bold text-yellow-400">
									{churnRisk.medium_risk_count || 0}
								</div>
							</Card>

							<Card className="bg-gray-900 border-l-4 border-green-500">
								<div className="text-sm text-gray-400 mb-1">Low Risk</div>
								<div className="text-3xl font-bold text-green-400">
									{churnRisk.low_risk_count || 0}
								</div>
							</Card>
						</div>

						
						<Card
							title="Risk Distribution"
							className="bg-gray-900 border-gray-800"
						>
							{chartData && <PieChart data={chartData} />}
						</Card>

						
						<Card
							title="User Predictions"
							className="bg-gray-900 border-gray-800"
						>
							
							<div className="flex gap-2 mb-6 flex-wrap">
								{[
									{ key: "all", label: "All", color: "cyan" },
									{ key: "high", label: "High Risk", color: "red" },
									{ key: "medium", label: "Medium Risk", color: "yellow" },
									{ key: "low", label: "Low Risk", color: "green" },
								].map((btn) => (
									<button
										key={btn.key}
										onClick={() => setFilter(btn.key)}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											filter === btn.key
												? `bg-${btn.color}-500 text-white`
												: "bg-gray-800 text-gray-300 hover:bg-gray-700"
										}`}
									>
										{btn.label} (
										{btn.key === "all"
											? churnRisk.total_users
											: churnRisk[`${btn.key}_risk_count`]}
										)
									</button>
								))}
							</div>

							
							<div className="space-y-3">
								{filteredPredictions.map((pred) => (
									<div
										key={pred.user_id}
										className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700"
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<span className="font-semibold text-white">
														User {pred.user_id}
													</span>
													<Badge variant={getRiskVariant(pred.risk_level)}>
														{pred.risk_level}
													</Badge>
												</div>
												{pred.interpretation && (
													<p className="text-sm text-gray-400">
														{pred.interpretation}
													</p>
												)}
											</div>

											<div className="flex items-center gap-6">
												<div className="text-center">
													<div className="text-sm text-gray-400 mb-1">
														Probability
													</div>
													<div
														className={`text-2xl font-bold ${getRiskColor(
															pred.risk_level,
														)}`}
													>
														{(pred.churn_probability * 100).toFixed(0)}%
													</div>
												</div>

											</div>
										</div>
									</div>
								))}

								{filteredPredictions.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										No users in this category
									</div>
								)}
							</div>
						</Card>

						
						<Card
							title="Recommended Actions"
							className="bg-gray-900 border-gray-800"
						>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
									<h4 className="font-semibold text-red-400 mb-2">
										High Risk Users
									</h4>
									<ul className="text-sm text-gray-400 space-y-1">
										<li>• Send immediate re-engagement email</li>
										<li>• Offer exclusive discount/incentive</li>
										<li>• Personal outreach from support team</li>
									</ul>
								</div>

								<div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
									<h4 className="font-semibold text-yellow-400 mb-2">
										Medium Risk Users
									</h4>
									<ul className="text-sm text-gray-400 space-y-1">
										<li>• Monitor activity closely</li>
										<li>• Send personalized content</li>
										<li>• Identify pain points</li>
									</ul>
								</div>

								<div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
									<h4 className="font-semibold text-green-400 mb-2">
										Low Risk Users
									</h4>
									<ul className="text-sm text-gray-400 space-y-1">
										<li>• Maintain current engagement</li>
										<li>• Upsell opportunities</li>
										<li>• Request feedback/testimonials</li>
									</ul>
								</div>
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChurnRisk;
