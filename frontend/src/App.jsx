import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "./context/SessionContext";


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


import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
								<DemoWebsites />
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
											className="px-6 py-3 bg-linear-to-r from-cyan-400 to-purple-500 text-white rounded-xl hover:opacity-90 transition"
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
