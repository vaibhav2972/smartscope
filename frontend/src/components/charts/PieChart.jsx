

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title }) => {
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					padding: 15,
					font: {
						size: 12,
						family: "Inter, system-ui, sans-serif",
					},
				},
			},
			title: {
				display: !!title,
				text: title,
				font: {
					size: 16,
					weight: "bold",
					family: "Inter, system-ui, sans-serif",
				},
				padding: {
					bottom: 20,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const label = context.label || "";
						const value = context.parsed || 0;
						const total = context.dataset.data.reduce((a, b) => a + b, 0);
						const percentage = ((value / total) * 100).toFixed(1);
						return `${label}: ${value} (${percentage}%)`;
					},
				},
			},
		},
	};

	return (
		<div className="h-72 w-full">
			<Pie data={data} options={chartOptions} />
		</div>
	);
};

export default PieChart;
