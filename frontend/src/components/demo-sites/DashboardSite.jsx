import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Users,
	ShoppingBag,
	DollarSign,
	Download,
	Calendar,
	Filter,
	RefreshCw,
	Activity,
	Package,
	CreditCard,
} from "lucide-react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { InteractionProvider } from "@/context/InteractionContext";
import { useInteractionTracker } from "@/hooks/useInteractionTracker";
import { useWebsites } from "@/hooks/useWebsites";

const DashboardContent = ({ websiteId }) => {
	const navigate = useNavigate();
	const { currentSession, startSession, endSession } = useSession();
	const { trackClick, trackPageView } = useInteractionTracker();

	const [selectedMetric, setSelectedMetric] = useState("revenue");
	const [timeRange, setTimeRange] = useState("week");
	const [isRefreshing, setIsRefreshing] = useState(false);

	const metrics = [
		{
			id: "revenue",
			label: "Total Revenue",
			value: "₹2,45,680",
			change: "+12.5%",
			trend: "up",
			icon: DollarSign,
			color: "text-green-400",
			bgColor: "bg-green-900/30",
			borderColor: "border-green-500/20",
		},
		{
			id: "users",
			label: "Active Users",
			value: "8,549",
			change: "+8.2%",
			trend: "up",
			icon: Users,
			color: "text-blue-400",
			bgColor: "bg-blue-900/30",
			borderColor: "border-blue-500/20",
		},
		{
			id: "orders",
			label: "Total Orders",
			value: "1,234",
			change: "+15.3%",
			trend: "up",
			icon: ShoppingBag,
			color: "text-purple-400",
			bgColor: "bg-purple-900/30",
			borderColor: "border-purple-500/20",
		},
		{
			id: "conversion",
			label: "Conversion Rate",
			value: "3.24%",
			change: "-2.1%",
			trend: "down",
			icon: Activity,
			color: "text-orange-400",
			bgColor: "bg-orange-900/30",
			borderColor: "border-orange-500/20",
		},
	];

	const recentActivity = [
		{
			id: 1,
			user: "John Doe",
			email: "john@example.com",
			action: "Made a purchase",
			amount: "₹2,499",
			time: "2 min ago",
			status: "completed",
			avatar: "👨‍💼",
		},
		{
			id: 2,
			user: "Jane Smith",
			email: "jane@example.com",
			action: "Signed up",
			amount: "-",
			time: "5 min ago",
			status: "new",
			avatar: "👩‍💼",
		},
		{
			id: 3,
			user: "Mike Johnson",
			email: "mike@example.com",
			action: "Added to cart",
			amount: "₹1,299",
			time: "12 min ago",
			status: "pending",
			avatar: "👨‍💻",
		},
		{
			id: 4,
			user: "Sarah Williams",
			email: "sarah@example.com",
			action: "Made a purchase",
			amount: "₹5,999",
			time: "18 min ago",
			status: "completed",
			avatar: "👩‍🔬",
		},
		{
			id: 5,
			user: "Tom Brown",
			email: "tom@example.com",
			action: "Left a review",
			amount: "-",
			time: "25 min ago",
			status: "completed",
			avatar: "👨‍🎨",
		},
		{
			id: 6,
			user: "Emily Davis",
			email: "emily@example.com",
			action: "Refund requested",
			amount: "₹3,200",
			time: "32 min ago",
			status: "refund",
			avatar: "👩‍⚕️",
		},
		{
			id: 7,
			user: "David Wilson",
			email: "david@example.com",
			action: "Made a purchase",
			amount: "₹899",
			time: "45 min ago",
			status: "completed",
			avatar: "👨‍🏫",
		},
	];

	const topProducts = [
		{
			id: 1,
			name: "Wireless Headphones Pro",
			sales: 234,
			revenue: "₹7,01,766",
			trend: "+12%",
			image: "🎧",
		},
		{
			id: 2,
			name: "Smart Watch Ultra",
			sales: 189,
			revenue: "₹17,00,811",
			trend: "+24%",
			image: "⌚",
		},
		{
			id: 3,
			name: "Bluetooth Speaker",
			sales: 156,
			revenue: "₹5,45,844",
			trend: "+8%",
			image: "🔊",
		},
		{
			id: 4,
			name: "Gaming Mouse RGB",
			sales: 142,
			revenue: "₹2,83,858",
			trend: "+15%",
			image: "🖱️",
		},
		{
			id: 5,
			name: "Mechanical Keyboard",
			sales: 98,
			revenue: "₹4,89,902",
			trend: "+18%",
			image: "⌨️",
		},
	];

	const chartData = {
		week: [
			{ day: "Mon", value: 45, sales: 12 },
			{ day: "Tue", value: 52, sales: 18 },
			{ day: "Wed", value: 48, sales: 15 },
			{ day: "Thu", value: 65, sales: 24 },
			{ day: "Fri", value: 58, sales: 21 },
			{ day: "Sat", value: 70, sales: 28 },
			{ day: "Sun", value: 68, sales: 25 },
		],
		month: Array.from({ length: 30 }, (_, i) => ({
			day: i + 1,
			value: Math.floor(Math.random() * 50) + 40,
			sales: Math.floor(Math.random() * 20) + 10,
		})),
		year: [
			{ day: "Jan", value: 120, sales: 340 },
			{ day: "Feb", value: 135, sales: 380 },
			{ day: "Mar", value: 128, sales: 360 },
			{ day: "Apr", value: 145, sales: 410 },
			{ day: "May", value: 158, sales: 445 },
			{ day: "Jun", value: 162, sales: 460 },
			{ day: "Jul", value: 170, sales: 480 },
			{ day: "Aug", value: 165, sales: 470 },
			{ day: "Sep", value: 180, sales: 510 },
			{ day: "Oct", value: 175, sales: 495 },
			{ day: "Nov", value: 188, sales: 530 },
			{ day: "Dec", value: 195, sales: 550 },
		],
	};

	useEffect(() => {
		if (websiteId && !currentSession) {
			startSession(websiteId);
		}
		trackPageView("Analytics Dashboard");
		return () => {
			if (currentSession) {
				endSession("/demo/dashboard");
			}
		};
	}, [websiteId]);

	const handleMetricClick = (metric) => {
		setSelectedMetric(metric.id);
		trackClick(`metric-${metric.id}`, "card", metric.label, {
			interactionType: "view",
			actionCategory: "engagement",
		});
	};

	const handleExport = () => {
		trackClick("export-data", "button", "Export Dashboard Data", {
			interactionType: "download",
			actionCategory: "engagement",
		});
	};

	const handleRefresh = () => {
		setIsRefreshing(true);
		trackClick("refresh-data", "button", "Refresh Dashboard");
		setTimeout(() => setIsRefreshing(false), 1000);
	};

	const currentData = chartData[timeRange];
	const maxValue = Math.max(...currentData.map((d) => d.value));

	return (
		<div className="min-h-screen bg-gray-950">
			
			<header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={async () => {
								trackClick("back-button", "button", "Back to Demo Selection");
								
								if (currentSession) {
									await endSession("/demo/dashboard");
								}
								navigate("/demo");
							}}
							className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-2xl font-bold bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
							DataDash
						</h1>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
						>
							<RefreshCw
								className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
							/>
							<span className="hidden sm:inline">Refresh</span>
						</button>
						<button
							onClick={handleExport}
							className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition font-semibold shadow-lg"
						>
							<Download className="w-4 h-4" />
							<span className="hidden sm:inline">Export</span>
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 py-8">
				
				<div className="flex items-center justify-between mb-8">
					<div className="flex gap-3">
						{[
							{ id: "week", label: "This Week", icon: Calendar },
							{ id: "month", label: "This Month", icon: Calendar },
							{ id: "year", label: "This Year", icon: Calendar },
						].map((range) => {
							const Icon = range.icon;
							return (
								<button
									key={range.id}
									onClick={() => {
										setTimeRange(range.id);
										trackClick(`timerange-${range.id}`, "button", range.label);
									}}
									className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
										timeRange === range.id
											? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg"
											: "bg-gray-900 border border-gray-800 text-gray-300 hover:border-orange-500 hover:text-orange-400"
									}`}
								>
									<Icon className="w-4 h-4" />
									<span className="hidden sm:inline">{range.label}</span>
								</button>
							);
						})}
					</div>

					<button
						onClick={() =>
							trackClick("filter-button", "button", "Open Filters")
						}
						className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-400 transition"
					>
						<Filter className="w-4 h-4" />
						<span className="hidden sm:inline">Filters</span>
					</button>
				</div>

				
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{metrics.map((metric) => {
						const Icon = metric.icon;
						const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
						return (
							<div
								key={metric.id}
								onClick={() => handleMetricClick(metric)}
								className={`bg-gray-900 border ${metric.borderColor} rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/10 transition cursor-pointer ${
									selectedMetric === metric.id
										? "ring-2 ring-orange-500 shadow-xl shadow-orange-500/20"
										: ""
								}`}
							>
								<div className="flex items-start justify-between mb-4">
									<div
										className={`p-3 rounded-xl ${metric.bgColor} border ${metric.borderColor}`}
									>
										<Icon className={`w-6 h-6 ${metric.color}`} />
									</div>
									<div
										className={`flex items-center gap-1 ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}
									>
										<TrendIcon className="w-4 h-4" />
										<span className="text-sm font-semibold">
											{metric.change}
										</span>
									</div>
								</div>
								<h3 className="text-gray-400 text-sm mb-2">{metric.label}</h3>
								<p className="text-3xl font-bold text-white">{metric.value}</p>
							</div>
						);
					})}
				</div>

				
				<div className="grid lg:grid-cols-2 gap-6 mb-8">
					
					<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold text-white">Revenue Overview</h3>
							<span className="text-sm text-gray-500">
								{timeRange === "week"
									? "Last 7 days"
									: timeRange === "month"
										? "Last 30 days"
										: "Last 12 months"}
							</span>
						</div>

						<div className="flex items-end justify-between h-64 gap-2">
							{currentData.map((item, index) => (
								<div
									key={index}
									className="flex-1 flex flex-col items-center gap-2"
									onClick={() =>
										trackClick(
											`chart-bar-${index}`,
											"chart",
											`Bar ${index + 1}`,
										)
									}
								>
									<div className="relative w-full group cursor-pointer">
										<div
											className="bg-linear-to-t from-orange-600 to-orange-400 rounded-t-lg hover:from-orange-500 hover:to-orange-300 transition-all duration-300"
											style={{ height: `${(item.value / maxValue) * 100}%` }}
										>
											
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
												₹{item.value}k
											</div>
										</div>
									</div>
									<span className="text-xs text-gray-500">
										{typeof item.day === "number" ? item.day : item.day}
									</span>
								</div>
							))}
						</div>
					</div>

					
					<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
						<h3 className="text-xl font-bold text-white mb-6">
							Traffic Sources
						</h3>

						<div className="flex items-center justify-center h-48 mb-6">
							<div className="relative w-48 h-48">
								
								<svg className="w-full h-full -rotate-90">
									
									<circle
										cx="96"
										cy="96"
										r="80"
										fill="none"
										stroke="url(#gradient1)"
										strokeWidth="32"
										strokeDasharray="226 504"
										className="hover:stroke-width-36 transition-all cursor-pointer"
										onClick={() =>
											trackClick("traffic-direct", "chart", "Direct Traffic")
										}
									/>
									
									<circle
										cx="96"
										cy="96"
										r="80"
										fill="none"
										stroke="url(#gradient2)"
										strokeWidth="32"
										strokeDasharray="151 504"
										strokeDashoffset="-226"
										className="hover:stroke-width-36 transition-all cursor-pointer"
										onClick={() =>
											trackClick("traffic-social", "chart", "Social Traffic")
										}
									/>
									
									<circle
										cx="96"
										cy="96"
										r="80"
										fill="none"
										stroke="url(#gradient3)"
										strokeWidth="32"
										strokeDasharray="126 504"
										strokeDashoffset="-377"
										className="hover:stroke-width-36 transition-all cursor-pointer"
										onClick={() =>
											trackClick("traffic-search", "chart", "Search Traffic")
										}
									/>

									<defs>
										<linearGradient
											id="gradient1"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#3B82F6" />
											<stop offset="100%" stopColor="#60A5FA" />
										</linearGradient>
										<linearGradient
											id="gradient2"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#A855F7" />
											<stop offset="100%" stopColor="#C084FC" />
										</linearGradient>
										<linearGradient
											id="gradient3"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#F97316" />
											<stop offset="100%" stopColor="#FB923C" />
										</linearGradient>
									</defs>
								</svg>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							{[
								{ label: "Direct", value: "45%", color: "bg-blue-500" },
								{ label: "Social", value: "30%", color: "bg-purple-500" },
								{ label: "Search", value: "25%", color: "bg-orange-500" },
							].map((source, index) => (
								<div key={index} className="text-center">
									<div
										className={`w-4 h-4 ${source.color} rounded-full mx-auto mb-2`}
									></div>
									<p className="text-sm text-gray-400">{source.label}</p>
									<p className="font-bold text-white text-lg">{source.value}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				
				<div className="grid lg:grid-cols-2 gap-6">
					
					<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold text-white">Recent Activity</h3>
							<button
								onClick={() =>
									trackClick("view-all-activity", "button", "View All Activity")
								}
								className="text-sm text-orange-400 hover:text-orange-300 transition"
							>
								View All
							</button>
						</div>

						<div className="space-y-3 max-h-96 overflow-y-auto">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									onClick={() =>
										trackClick(
											`activity-${activity.id}`,
											"row",
											activity.action,
										)
									}
									className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-xl transition cursor-pointer group"
								>
									<div className="flex items-center gap-4">
										<div className="text-3xl">{activity.avatar}</div>
										<div>
											<p className="font-semibold text-white group-hover:text-orange-400 transition">
												{activity.user}
											</p>
											<p className="text-sm text-gray-500">{activity.email}</p>
											<p className="text-sm text-gray-400">{activity.action}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold text-white">
											{activity.amount}
										</p>
										<p className="text-xs text-gray-500">{activity.time}</p>
										<span
											className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
												activity.status === "completed"
													? "bg-green-900/30 text-green-400"
													: activity.status === "pending"
														? "bg-yellow-900/30 text-yellow-400"
														: activity.status === "refund"
															? "bg-red-900/30 text-red-400"
															: "bg-blue-900/30 text-blue-400"
											}`}
										>
											{activity.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					
					<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold text-white">Top Products</h3>
							<button
								onClick={() =>
									trackClick("view-all-products", "button", "View All Products")
								}
								className="text-sm text-orange-400 hover:text-orange-300 transition"
							>
								View All
							</button>
						</div>

						<div className="space-y-4">
							{topProducts.map((product, index) => (
								<div
									key={product.id}
									onClick={() =>
										trackClick(`product-${product.id}`, "row", product.name)
									}
									className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-xl transition cursor-pointer group"
								>
									<div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl text-2xl group-hover:scale-110 transition">
										{product.image}
									</div>
									<div className="flex-1">
										<p className="font-semibold text-white group-hover:text-orange-400 transition">
											{product.name}
										</p>
										<p className="text-sm text-gray-500">
											{product.sales} sales
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-white">{product.revenue}</p>
										<p className="text-sm text-green-400">{product.trend}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const DashboardSite = () => {
	const { websites, loading } = useWebsites();
	const dashboardWebsite = websites.find(
		(w) => w.type === "dashboard" || w.category === "saas",
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	if (!dashboardWebsite) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center">
				<div className="text-white">Dashboard site not found</div>
			</div>
		);
	}

	return (
		<SessionProvider>
			<InteractionProvider websiteId={dashboardWebsite._id}>
				<DashboardContent websiteId={dashboardWebsite._id} />
			</InteractionProvider>
		</SessionProvider>
	);
};

export default DashboardSite;
