

import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

const BarChart = ({ data, title, horizontal = false }) => {
	const chartOptions = {
		indexAxis: horizontal ? "y" : "x",
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
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
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(0, 0, 0, 0.05)",
				},
			},
		},
	};

	return (
		<div className="h-72 w-full">
			<Bar data={data} options={chartOptions} />
		</div>
	);
};

export default BarChart;
