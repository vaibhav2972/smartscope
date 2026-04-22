import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
	BarChart3,
	Brain,
	Users,
	TrendingUp,
	AlertTriangle,
	Gem,
	RefreshCw,
	Menu,
	X,
	LogOut,
	Home,
	Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AnalyticsLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/", { replace: true });
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	const menuItems = [
		{ name: "Dashboard", path: "/analytics", icon: BarChart3 },
		{
			name: "User Intelligence",
			path: "/analytics/user-intelligence",
			icon: Brain,
		},
		{ name: "User Segments", path: "/analytics/segments", icon: Users },
		{ name: "Engagement", path: "/analytics/engagement", icon: TrendingUp },
		{
			name: "Recommendations",
			path: "/analytics/recommendations",
			icon: Sparkles,
		},
		{ name: "Churn Risk", path: "/analytics/churn", icon: AlertTriangle },
		{ name: "RFM Analysis", path: "/analytics/rfm", icon: Gem },
		{ name: "User Lifecycle", path: "/analytics/lifecycle", icon: RefreshCw },
		{
			name: "Behavior Drivers",
			path: "/analytics/behavior-importance",
			icon: Brain,
		},
		{
			name: "Feature Attribution",
			path: "/analytics/feature-attribution",
			icon: Sparkles,
		},
		{
			name: "Website Intelligence",
			path: "/analytics/website-intelligence",
			icon: BarChart3,
		},
	];

	return (
		<div className="min-h-screen bg-gray-950">
			
			<div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50">
				<div className="flex items-center justify-between h-full px-4">
					
					<div className="flex items-center gap-4">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
						>
							{sidebarOpen ? (
								<X className="w-6 h-6 text-white" />
							) : (
								<Menu className="w-6 h-6 text-white" />
							)}
						</button>

						<Link to="/analytics" className="flex items-center gap-2">
							<BarChart3 className="w-8 h-8 text-cyan-400" />
							<span className="text-xl font-bold bg-linear-to-r from-cyan-400 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
								SmartScope Analytics
							</span>
						</Link>
					</div>

					
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
						>
							<Home className="w-4 h-4" />
							<span className="text-sm">Back to Home</span>
						</Link>

						<div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
							<div className="w-9 h-9 rounded-full bg-linear-to-r from-cyan-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
								{user?.username?.charAt(0).toUpperCase() || "A"}
							</div>
							<div className="hidden sm:block">
								<div className="text-sm font-semibold text-white">
									{user?.username || "Admin"}
								</div>
								<div className="text-xs text-cyan-400">Analyst</div>
							</div>
						</div>

						
					</div>
				</div>
			</div>

			
			<div
				className={`fixed left-0 top-16 bottom-0 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0`}
			>
				<nav className="p-4 space-y-1 overflow-y-auto h-full">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;

						return (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
									isActive
										? "bg-linear-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/10"
										: "text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-gray-700"
								}`}
							>
								<Icon
									className={`w-5 h-5 ${isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`}
								/>
								<span className="font-medium">{item.name}</span>
							</Link>
						);
					})}

					
					<div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-gray-800">
						<div className="text-xs text-gray-500 text-center">
							SmartScope v1.0
						</div>
						<div className="text-xs text-gray-600 text-center mt-1">
							User Behavior Intelligence
						</div>
					</div>
				</nav>
			</div>

			
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			
			<div className="lg:pl-64 pt-16">
				<main className="min-h-screen bg-gray-950">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AnalyticsLayout;
