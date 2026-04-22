import React, { useState } from "react";
import { useBehaviorImportance } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";

const BehaviorImportance = () => {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [activeUserId, setActiveUserId] = useState("");

	const { data, loading, error } = useBehaviorImportance(activeUserId);

	const handleSearch = (e) => {
		e.preventDefault();
		if (selectedUserId.trim()) setActiveUserId(selectedUserId);
	};

	const getimportanceStyle = (p) => {
		if (p === "low")
			return "bg-red-500/10 text-red-300 border border-red-500/20";
		if (p === "moderate")
			return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
		return "bg-green-500/10 text-green-300 border border-green-500/20";
	};

	
	const getPriorityStyle = (p) => {
		if (p === "high")
			return "bg-red-500/10 text-red-300 border border-red-500/20";
		if (p === "medium")
			return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
		return "bg-green-500/10 text-green-300 border border-green-500/20";
	};

	
	const getContextPill = (item) => {
		if (item.strength) {
			return {
				label: item.strength,
				style: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
				title: "Strength",
			};
		}

		if (item.problem) {
			return {
				label: item.problem,
				style: "bg-orange-500/10 text-orange-300 border border-orange-500/20",
				title: "Problem",
			};
		}

		return null;
	};

	return (
		<div className="min-h-screen bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white">Behavior Importance</h1>
					<p className="text-gray-400 mt-2">
						AI-driven behavioral drivers and optimization signals
					</p>
				</div>

				
				<Card className="mb-6 bg-gray-900 border-gray-800">
					<form onSubmit={handleSearch} className="flex gap-4">
						<input
							value={selectedUserId}
							onChange={(e) => setSelectedUserId(e.target.value)}
							placeholder="Enter User ID"
							className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
						/>
						<button className="px-6 py-2 bg-linear-to-r from-cyan-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition">
							Analyze
						</button>
					</form>
				</Card>

				{loading && <LoadingSpinner text="Analyzing behavior patterns..." />}

				{error && (
					<Card className="bg-gray-900 border-gray-800 text-red-400 text-center">
						{error}
					</Card>
				)}

				
				{data?.success && (
					<div className="space-y-6">
						
						<Card className="bg-gray-900 border-gray-800">
							<div className="p-5 border-l-4 border-cyan-500/40">
								<p className="text-white text-lg font-medium">{data.summary}</p>
							</div>
						</Card>

						<Card
							title="Behavior Drivers"
							className="bg-gray-900 border-gray-800"
						>
							<div className="space-y-4">
								{data.top_factors?.map((f, i) => {
									const context = getContextPill(f);

									return (
										<div
											key={i}
											className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-900/60 transition"
										>
											<div className="flex justify-between items-start">
												
												<div className="flex gap-4">
													<div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold">
														{i + 1}
													</div>

													<div>
														<div className="text-white font-semibold">
															{f.factor}
														</div>

														<div className="text-gray-500 text-sm mt-1">
															{f.insight}
														</div>

														
														{context && (
															<div className="mt-2">
																<span
																	className={`px-2 py-1 text-xs rounded-full ${context.style}`}
																>
																	{context.title}: {context.label}
																</span>
															</div>
														)}
													</div>
												</div>

												
												<div className="text-right space-y-2">
													<div className="text-white font-semibold">
														{f.percentile}
													</div>

													<span
														className={`px-2 py-1 text-xs rounded-full ${getimportanceStyle(
															f.importance_level?.toLowerCase(),
														)}`}
													>
														{f.importance_level}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</Card>

						<Card
							title="Optimization Actions"
							className="bg-gray-900 border-gray-800"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{data.actions?.map((a, i) => {
									const context = a.strength || a.problem;

									return (
										<div
											key={i}
											className="p-5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-900/60 transition"
										>
											
											<div className="flex justify-between items-center mb-3">
												<div className="text-white font-semibold">
													{a.action || a.fix || "—"}
												</div>

												<span
													className={`px-2 py-1 text-xs rounded-full ${getPriorityStyle(
														a.priority,
													)}`}
												>
													{a.priority}
												</span>
											</div>

											
											<div className="text-sm text-gray-400 space-y-1">
												<div>
													<span className="text-gray-500">Goal:</span>{" "}
													{a.goal || "-"}
												</div>
												<div>
													<span className="text-gray-500">Type:</span>{" "}
													{a.type || "-"}
												</div>

												
												{a.strength && (
													<div>
														<span className="text-gray-500">Strength:</span>{" "}
														{a.strength}
													</div>
												)}

												{a.problem && (
													<div>
														<span className="text-gray-500">Problem:</span>{" "}
														{a.problem}
													</div>
												)}

												{!a.strength && !a.problem && (
													<div className="text-gray-600">
														No additional context
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</Card>
					</div>
				)}

				
				{!loading && !data && activeUserId && (
					<Card className="bg-gray-900 border-gray-800 text-center text-gray-500">
						No behavioral data found for this user
					</Card>
				)}
			</div>
		</div>
	);
};

export default BehaviorImportance;
