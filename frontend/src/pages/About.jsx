import React from "react";
import { Target, Users, Zap, Award } from "lucide-react";

const About = () => {
	const values = [
		{
			icon: Target,
			title: "Our Mission",
			description:
				"To make user behavior analytics accessible and actionable for everyone through ML-powered insights.",
		},
		{
			icon: Users,
			title: "For Students",
			description:
				"Built as an educational platform to demonstrate real-world web analytics and machine learning applications.",
		},
		{
			icon: Zap,
			title: "Innovation First",
			description:
				"Combining modern web technologies with cutting-edge ML algorithms to solve real problems.",
		},
		{
			icon: Award,
			title: "Open Learning",
			description:
				"Transparent architecture that shows exactly how user tracking and analysis works under the hood.",
		},
	];

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
			<div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					
					<div className="text-center mb-20">
						<h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
							About SmartScope
						</h1>
						<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
							A platform-agnostic user behavior intelligence system that adapts
							to any digital platform and provides ML-powered insights,
							predictions, and recommendations.
						</p>
					</div>

					
					<div className="mb-20">
						<div className="bg-linear-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12">
							<h2 className="text-3xl font-bold text-white mb-6">What We Do</h2>
							<p className="text-gray-300 text-lg leading-relaxed mb-6">
								SmartScope captures and analyzes user interactions across
								multiple simulated platforms including e-commerce, social media,
								blogs, and dashboards. Unlike traditional analytics tools that
								focus solely on web traffic, we provide deep behavioral insights
								through machine learning.
							</p>
							<p className="text-gray-300 text-lg leading-relaxed">
								Our system tracks every click, scroll, search, and interaction,
								then processes this data using advanced ML algorithms to
								identify patterns, predict user behavior, and generate
								actionable recommendations.
							</p>
						</div>
					</div>

					
					<div className="grid md:grid-cols-2 gap-8 mb-20">
						{values.map((value, index) => {
							const Icon = value.icon;
							return (
								<div
									key={index}
									className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300"
								>
									<div className="w-14 h-14 rounded-xl bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center mb-4">
										<Icon className="w-7 h-7 text-white" />
									</div>
									<h3 className="text-2xl font-bold text-white mb-3">
										{value.title}
									</h3>
									<p className="text-gray-400 leading-relaxed">
										{value.description}
									</p>
								</div>
							);
						})}
					</div>

					
					<div className="text-center">
						<h2 className="text-3xl font-bold text-white mb-8">Built With</h2>
						<div className="flex flex-wrap justify-center gap-4">
							{[
								"React",
								"Node.js",
								"MongoDB",
								"Express",
								"Python",
								"Tailwind CSS",
							].map((tech) => (
								<span
									key={tech}
									className="px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-300 font-semibold hover:border-cyan-500/50 transition-all"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
