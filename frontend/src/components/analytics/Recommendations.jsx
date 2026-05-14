

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRecommendations, useSimilarUsers } from "../../hooks/useAnalytics";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import { Search, Sparkles, Users as UsersIcon, TrendingUp } from "lucide-react";

const Recommendations = () => {
	const { user } = useAuth();
	const [selectedUserId, setSelectedUserId] = useState("");
	const [entityType, setEntityType] = useState("product");

	const {
		recommendations,
		loading: recLoading,
		error: recError,
		fetchRecommendations,
	} = useRecommendations();

	const {
		similarUsers,
		loading: simLoading,
		error: simError,
		fetchSimilarUsers,
	} = useSimilarUsers();

	// ✅ Combined states
	const loading = recLoading || simLoading;
	const error = recError || simError;

	const handleSearch = async (e) => {
		e.preventDefault();

		if (!selectedUserId.trim()) return;

		await Promise.all([
			fetchRecommendations(selectedUserId, {
				entityType: entityType,
				limit: 5,
			}),
			fetchSimilarUsers(selectedUserId, {
				entityType: entityType,
				limit: 5,
			}),
		]);
	};

	return (
		<div className="bg-gray-950 p-6">
			<div className="max-w-7xl mx-auto">
				
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white flex items-center gap-3">
						<Sparkles className="w-8 h-8 text-cyan-400" />
						Personalized Recommendations
					</h1>
					<p className="mt-2 text-gray-400">
						AI-powered recommendations using collaborative filtering
					</p>
				</div>

				
				<Card className="mb-6 bg-gray-900 border-gray-800">
					<form onSubmit={handleSearch} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							
							<div>
								<label className="block text-sm text-gray-300 mb-2">
									User ID
								</label>
								<input
									type="text"
									value={selectedUserId}
									onChange={(e) => setSelectedUserId(e.target.value)}
									placeholder="Enter user ID"
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
								/>
							</div>

							
							<div>
								<label className="block text-sm text-gray-300 mb-2">
									Item Type
								</label>
								<select
									value={entityType}
									onChange={(e) => setEntityType(e.target.value)}
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
								>
									<option value="product">Products</option>
									<option value="article">Articles</option>
									<option value="post">Posts</option>
								</select>
							</div>

							
							<div className="flex items-end">
								<button
									type="submit"
									disabled={loading}
									className="w-full px-6 py-2 bg-linear-to-r from-cyan-500 to-indigo-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
								>
									<Search className="w-5 h-5" />
									{loading ? "Searching..." : "Get Recommendations"}
								</button>
							</div>
						</div>
					</form>
				</Card>

				
				{loading && <LoadingSpinner text="Analyzing user preferences..." />}

				
				{error && !loading && (
					<Card className="bg-gray-900 border-gray-800">
						<div className="text-center py-8 text-red-400">{error}</div>
					</Card>
				)}

				
				{!loading && !error && (recommendations || similarUsers) && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						
						{recommendations && (
							<Card
								title="Recommended Items"
								className="bg-gray-900 border-gray-800"
							>
								{recommendations.success &&
								recommendations.recommendations?.length > 0 ? (
									<div className="space-y-3">
										{recommendations.recommendations.map((rec, i) => (
											<div
												key={rec.item_id}
												className="p-4 bg-gray-800 rounded-lg border border-gray-700"
											>
												<div className="flex justify-between">
													<div>
														<div className="text-white font-semibold">
															{rec.item_name || `Item ${rec.item_id.slice(-6)}`}
														</div>
														{/* <div className="text-xs text-gray-400">
															{rec.reason}
														</div> */}
													</div>
													{/* <div className="text-cyan-400 font-bold">
														{(rec.score * 100).toFixed(0)}%
													</div> */}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center text-gray-400 py-6">
										No recommendations found
									</div>
								)}
							</Card>
						)}

						
						{similarUsers && (
							<Card
								title="Similar Users"
								className="bg-gray-900 border-gray-800"
							>
								{similarUsers.success &&
								similarUsers.similar_users?.length > 0 ? (
									<div className="space-y-3">
										{similarUsers.similar_users.map((u, i) => {
											const similarity = u.similarity_score * 100;

											return (
												<div
													key={u.user_id}
													className="p-4 bg-gray-800 rounded-lg border border-gray-700"
												>
													<div className="flex justify-between">
														<div className="text-white">
															User {u.user_id}
														</div>
														<div className="text-indigo-400 font-bold">
															{similarity.toFixed(1)}%
														</div>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<div className="text-center text-gray-400 py-6">
										No similar users found
									</div>
								)}
							</Card>
						)}
					</div>
				)}

				
				{!loading && !error && !recommendations && !similarUsers && (
					<Card className="bg-gray-900 border-gray-800">
						<div className="text-center py-16 text-gray-400">
							<Sparkles className="w-12 h-12 mx-auto mb-4" />
							Enter a user ID to get recommendations
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

export default Recommendations;
