import React from "react";

const StatCard = ({
	title,
	value,
	icon,
	trend,
	trendValue,
	color = "blue",
}) => {
	const colorClasses = {
		blue: "bg-blue-500/20 text-blue-400",
		green: "bg-green-500/20 text-green-400",
		orange: "bg-orange-500/20 text-orange-400",
		purple: "bg-purple-500/20 text-purple-400",
		red: "bg-red-500/20 text-red-400",
	};

	const trendClasses = {
		up: "bg-green-500/20 text-green-400",
		down: "bg-red-500/20 text-red-400",
	};

	return (
		<div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
			<div className="flex justify-between items-start mb-4">
				<div
					className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]}`}
				>
					{icon}
				</div>

				{trend && (
					<div
						className={`px-2 py-1 rounded-md text-sm font-semibold ${trendClasses[trend]}`}
					>
						{trend === "up" ? "↑" : "↓"} {trendValue}
					</div>
				)}
			</div>

			<div className="mt-4">
				<div className="text-3xl font-bold text-white">{value}</div>
				<div className="mt-1 text-sm font-medium text-gray-400 uppercase tracking-wide">
					{title}
				</div>
			</div>
		</div>
	);
};

export default StatCard;
