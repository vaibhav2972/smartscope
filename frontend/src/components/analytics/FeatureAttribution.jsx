import React, { useState } from "react";
import { useFeatureAttribution } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";

const FeatureAttribution = () => {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [activeUserId, setActiveUserId] = useState("");

	const { data, loading, error } = useFeatureAttribution(activeUserId);

	const handleSearch = (e) => {
		e.preventDefault();
		if (selectedUserId.trim()) setActiveUserId(selectedUserId);
	};

	// 🔥 DARK SAAS TAG SYSTEM (FIXED)
	const getTypeStyle = (type) => {
		if (type === "fix")
			return "bg-red-600 text-white border border-red-500/20";
		if (type === "optimize")
			return "bg-yellow-600 text-white border border-yellow-500/20";
		return "bg-green-600 text-white border border-emerald-500/20";
	};

	const getImpactColor = (level) => {
		if (level === "Low") return "text-red-600";
		if (level === "High") return "text-yellow-600";
		return "text-green-600";
	};

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">Feature Attribution</h1>
					<p className="text-gray-400 mt-2">
						AI-powered breakdown of feature-level behavioral influence
					</p>
				</div>

				
				<Card className="mb-6 bg-gray-900 border-gray-800">
					<form onSubmit={handleSearch} className="flex gap-4">
						<input
							value={selectedUserId}
							onChange={(e) => setSelectedUserId(e.target.value)}
							placeholder="Enter User ID"
							className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
						/>
						<button className="px-6 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition">
							Analyze
						</button>
					</form>
				</Card>

				{loading && <LoadingSpinner text="Mapping feature influence..." />}

				{error && (
					<Card className="bg-gray-900 border-gray-800 text-red-400 text-center">
						{error}
					</Card>
				)}

				
				{data?.success && (
					<div className="space-y-6">
						
						<Card className="bg-gray-900 border-gray-800">
							<div className="p-5 border-l-4 border-indigo-500/40">
								<p className="text-white font-semibold text-lg">
									{data.summary}
								</p>
							</div>
						</Card>

						
						<Card
							title="Feature Drivers"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-3">
								{data.top_drivers?.map((d, i) => (
									<div
										key={i}
										className="flex justify-between items-center p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition"
									>
										
										<div className="flex items-center gap-4">
											<div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold">
												{i + 1}
											</div>

											<div>
												<div className="text-white font-semibold">
													{d.feature}
												</div>
												<div className="text-sm text-gray-500">{d.insight}</div>
											</div>
										</div>

										
										<div className="text-right">
											<div
												className={`font-semibold ${getImpactColor(d.importance_level)}`}
											>
												{d.importance_level}
											</div>
											<div className="text-xs text-gray-500">impact</div>
										</div>
									</div>
								))}
							</div>
						</Card>

						
						<Card
							title="Feature-Level Actions"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-4">
								{data.top_drivers?.map((d, i) => (
									<div
										key={i}
										className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition"
									>
										
										<div className="flex justify-between items-center mb-4">
											<div className="text-white font-semibold">
												{d.feature}
											</div>

											<span
												className={`px-3 py-1 text-xs rounded-full ${getTypeStyle(
													d.action?.type,
												)}`}
											>
												{d.action?.type || "unknown"}
											</span>
										</div>

										
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
												<div className="text-xs text-gray-500 mb-1">Action</div>
												<div className="text-white text-sm space-y-1">
													{d.action?.type === "fix" &&
														d.action?.recommended_fix?.steps?.map((step, i) => (
															<div key={i}>{step}</div>
														))}

													{d.action?.type === "optimize" &&
														d.action?.recommended_actions?.map((step, i) => (
															<div key={i}>{step}</div>
														))}

													{d.action?.type === "maintain" &&
														d.action?.recommended_action?.steps?.map(
															(step, i) => <div key={i}>{step}</div>,
														)}
												</div>
											</div>

											<div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
												<div className="text-xs text-gray-500 mb-1">
													Priority
												</div>
												<div className="text-white text-sm">
													{d.action?.priority || "—"}
												</div>
											</div>

											<div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
												<div className="text-xs text-gray-500 mb-1">
													Why it matters
												</div>
												<div className="text-gray-300 text-sm">
													{d.why_it_matters || "—"}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				)}

				
				{!loading && !data && activeUserId && (
					<Card className="bg-gray-900 border-gray-800 text-center text-gray-500">
						No feature attribution data found
					</Card>
				)}
			</div>
		</div>
	);
};

export default FeatureAttribution;
