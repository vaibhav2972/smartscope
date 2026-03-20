import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebsites } from "@/hooks/useWebsites";
import { ShoppingCart, MessageCircle, FileText, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const DemoWebsites = () => {
	const navigate = useNavigate();
	const { websites, loading } = useWebsites();

	const demoSites = [
		{
			id: "ecommerce",
			name: "ShopVibe",
			description:
				"Modern e-commerce experience with products, cart, and checkout",
			icon: ShoppingCart,
			color: "from-blue-500 to-cyan-500",
			route: "/demo/ecommerce",
		},
		{
			id: "social",
			name: "SocialConnect",
			description: "Social media feed with posts, likes, comments, and shares",
			icon: MessageCircle,
			color: "from-purple-500 to-pink-500",
			route: "/demo/social",
		},
		{
			id: "blog",
			name: "TechBlog",
			description:
				"Content platform with articles, categories, and reading experience",
			icon: FileText,
			color: "from-green-500 to-teal-500",
			route: "/demo/blog",
		},
		// {
		// 	id: "dashboard",
		// 	name: "DataDash",
		// 	description:
		// 		"Analytics dashboard with charts, metrics, and data visualization",
		// 	icon: BarChart3,
		// 	color: "from-orange-500 to-red-500",
		// 	route: "/demo/dashboard",
		// },
	];

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-950">
				<Loader />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
			<Navbar />

			<div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					
					<div className="text-center mb-16">
						<h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
							Choose Your Experience
						</h1>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto">
							Interact with different demo websites while we analyze your
							behavior patterns
						</p>
					</div>

					
					<div className="grid md:grid-cols-2 gap-8">
						{demoSites.map((site) => {
							const Icon = site.icon;
							return (
								<div
									key={site.id}
									onClick={() => navigate(site.route)}
									className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
								>
									
									<div
										className={`absolute inset-0 bg-linear-to-br ${site.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
									></div>

									
									<div
										className={`w-16 h-16 rounded-xl bg-linear-to-br ${site.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
									>
										<Icon className="w-8 h-8 text-white" />
									</div>

									
									<h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
										{site.name}
									</h3>
									<p className="text-gray-400 mb-6">{site.description}</p>

									
									<button
										className={`px-6 py-3 rounded-xl bg-linear-to-r ${site.color} text-white font-semibold hover:shadow-lg transition-all duration-300`}
									>
										Launch Experience →
									</button>

									
									<div
										className={`absolute -inset-0.5 bg-linear-to-r ${site.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
									></div>
								</div>
							);
						})}
					</div>

					
					<div className="mt-16 text-center">
						<div className="inline-block bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
							<p className="text-gray-400">
								<span className="text-cyan-400 font-semibold">Note:</span> Your
								interactions are being tracked to analyze user behavior patterns
								for machine learning analysis.
							</p>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default DemoWebsites;
