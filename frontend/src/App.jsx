import "./App.css";
import {
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "./context/SessionContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsLayout from "./components/layouts/AnalyticsLayout";

import Home from "./pages/Home";
import Contact from "./pages/ContactUs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminSignUp from "./pages/AdminSignUp";
import DemoWebsites from "./pages/DemoWebsites";

import EcommerceSite from "./components/demo-sites/EcommerceSite";
import SocialMediaSite from "./components/demo-sites/SocialMediaSite";
import BlogSite from "./components/demo-sites/BlogSite";
import DashboardSite from "./components/demo-sites/DashboardSite";

import AnalyticsDashboard from "./components/analytics/Dashboard";
import UserIntelligence from "./components/analytics/UserIntelligence";
import UserSegments from "./components/analytics/UserSegments";
import EngagementLeaderboard from "./components/analytics/EngagementLeaderboard";
import ChurnRisk from "./components/analytics/ChurnRisk";
import RFMAnalysis from "./components/analytics/RFMAnalysis";
import UserLifecycle from "./components/analytics/UserLifecycle";
import Recommendations from "./components/analytics/Recommendations";
import BehaviorImportance from "./components/analytics/BehaviorImportance";
import FeatureAttribution from "./components/analytics/FeatureAttribution";
import WebsiteIntelligence from "./components/analytics/WebsiteIntelligence";

function App() {
	return (
		<>
			<Toaster
				position="bottom-right"
				toastOptions={{
					style: {
						background: "#1f2937",
						color: "#fff",
						borderRadius: "8px",
						padding: "12px 16px",
					},
				}}
			/>

			<SessionProvider>
				
				<Routes>

					<Route
						path="/"
						element={
							<>
								<Navbar />
								<Home />
								<Footer />
							</>
						}
					/>

					<Route
						path="/about"
						element={
							<>
								<Navbar />
								<About />
								<Footer />
							</>
						}
					/>

					<Route
						path="/contact"
						element={
							<>
								<Navbar />
								<Contact />
								<Footer />
							</>
						}
					/>

					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/adminlogin" element={<AdminLogin />} />
					<Route path="/adminsignup" element={<AdminSignUp />} />


					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Navbar />
								<Profile />
								<Footer />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/demo"
						element={
							<ProtectedRoute>
								<Navbar />
								<DemoWebsites />
								<Footer />
							</ProtectedRoute>
						}
					/>


					<Route
						path="/demo/ecommerce"
						element={
							<ProtectedRoute>
								<EcommerceSite />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/demo/social"
						element={
							<ProtectedRoute>
								<SocialMediaSite />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/demo/blog"
						element={
							<ProtectedRoute>
								<BlogSite />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/demo/dashboard"
						element={
							<ProtectedRoute>
								<DashboardSite />
							</ProtectedRoute>
						}
					/>


					<Route
						path="/analytics"
						element={
							<ProtectedRoute adminOnly={true}>
								<AnalyticsLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<AnalyticsDashboard />} />
						<Route path="user-intelligence" element={<UserIntelligence />} />
						<Route path="user/:userId" element={<UserIntelligence />} />
						<Route path="segments" element={<UserSegments />} />
						<Route path="engagement" element={<EngagementLeaderboard />} />
						<Route path="recommendations" element={<Recommendations />} />
						<Route path="churn" element={<ChurnRisk />} />
						<Route path="rfm" element={<RFMAnalysis />} />
						<Route path="lifecycle" element={<UserLifecycle />} />
						<Route
							path="behavior-importance"
							element={<BehaviorImportance />}
						/>
						<Route
							path="feature-attribution"
							element={<FeatureAttribution />}
						/>
						<Route
							path="website-intelligence"
							element={<WebsiteIntelligence />}
						/>
					</Route>


					<Route
						path="*"
						element={
							<>
								<Navbar />
								<div className="min-h-screen flex items-center justify-center bg-gray-950">
									<div className="text-center">
										<h1 className="text-6xl font-bold text-cyan-400 mb-4">
											404
										</h1>
										<p className="text-xl text-gray-400 mb-8">Page not found</p>
										<a
											href="/"
											className="px-6 py-3 bg-linear-to-r from-cyan-400 to-purple-500 text-white rounded-xl"
										>
											Go Home
										</a>
									</div>
								</div>
								<Footer />
							</>
						}
					/>
				</Routes>
				
			</SessionProvider>
		</>
	);
}

export default App;
