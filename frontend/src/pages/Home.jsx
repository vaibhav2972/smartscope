import React from "react";
import { Link } from "react-router-dom";
import { Zap, Brain, BarChart3, Layers, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
	const { user } = useAuth();

	const features = [
		{
			icon: Brain,
			title: "ML-Powered Analysis",
			description:
				"Machine learning algorithms analyze user behavior patterns in real-time",
			color: "from-cyan-400 to-blue-500",
		},
		{
			icon: BarChart3,
			title: "Deep Insights",
			description:
				"Get detailed analytics on user engagement, conversions, and interactions",
			color: "from-purple-400 to-pink-500",
		},
		{
			icon: Layers,
			title: "Multi-Platform",
			description:
				"Track user behavior across e-commerce, social media, blogs, dashboards and more",
			color: "from-green-400 to-teal-500",
		},
		{
			icon: Zap,
			title: "Real-Time Tracking",
			description: "Capture every click, scroll, and interaction as it happens",
			color: "from-orange-400 to-red-500",
		},
	];

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
			
			<section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
				
				<div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

				<div className="max-w-7xl mx-auto text-center relative z-10">
					<div className="inline-block mb-6">
						<span className="px-4 py-2 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold">
							🚀 Next-Gen User Analytics Platform
						</span>
					</div>

					<h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
						Understand Your Users
						<br />
						Like Never Before
					</h1>

					<p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
						SmartScope uses advanced machine learning to track, analyze, and
						predict user behavior across multiple platforms. Turn interactions
						into actionable insights.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						{user ? (
							<Link
								to="/demo"
								className="group px-8 py-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2"
							>
								Try Demo Sites
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						) : (
							<>
								<Link
									to="/signup"
									className="group px-8 py-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2"
								>
									Get Started Free
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
								<Link
									to="/about"
									className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300"
								>
									Learn More
								</Link>
							</>
						)}
					</div>

					
					<div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
						<div className="text-center">
							<p className="text-4xl font-bold text-cyan-400 mb-2">3+</p>
							<p className="text-gray-400">Demo Platforms</p>
						</div>
						<div className="text-center">
							<p className="text-4xl font-bold text-purple-400 mb-2">10+</p>
							<p className="text-gray-400">ML Algorithms</p>
						</div>
						<div className="text-center">
							<p className="text-4xl font-bold text-blue-400 mb-2">Detailed</p>
							<p className="text-gray-400">Analysis</p>
						</div>
					</div>
				</div>
			</section>

			
			<section className="py-20 px-4 sm:px-6 lg:px-8 relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
							Powerful Features
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto">
							Everything you need to understand and optimize user behavior
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<div
									key={index}
									className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
								>
									<div
										className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
									>
										<Icon className="w-7 h-7 text-white" />
									</div>
									<h3 className="text-xl font-bold text-white mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{feature.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-900/50 to-transparent">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
							How It Works
						</h2>
						<p className="text-gray-400 text-lg">
							Three simple steps to unlock user insights
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								step: "01",
								title: "Interact",
								description: "Use our demo websites just like real users would",
							},
							{
								step: "02",
								title: "Track",
								description:
									"Every action is captured and analyzed in real-time",
							},
							{
								step: "03",
								title: "Analyze",
								description:
									"ML algorithms process data to reveal patterns and insights",
							},
						].map((item, index) => (
							<div key={index} className="text-center relative">
								<div className="text-6xl font-bold bg-linear-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
									{item.step}
								</div>
								<h3 className="text-2xl font-bold text-white mb-3">
									{item.title}
								</h3>
								<p className="text-gray-400">{item.description}</p>
								{index < 2 && (
									<div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-linear-to-r from-cyan-400 to-purple-500"></div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center bg-linear-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12">
					<h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
						Ready to Get Started?
					</h2>
					<p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
						Join SmartScope today and discover how your users really interact
						with your platforms
					</p>
					{user ? (
						<Link
							to="/demo"
							className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
						>
							Launch Demo Experience
							<ArrowRight className="w-5 h-5" />
						</Link>
					) : (
						<Link
							to="/signup"
							className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
						>
							Create Free Account
							<ArrowRight className="w-5 h-5" />
						</Link>
					)}
				</div>
			</section>
		</div>
	);
};

export default Home;
