import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Shield, ArrowLeft } from "lucide-react";

const AdminSignUp = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		adminPassKey: "",
	});
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [showOtp, setShowOtp] = useState(false);
	const [otp, setOtp] = useState("");

	const navigate = useNavigate();
	const { setUser, user } = useAuth();

	useEffect(() => {
		if (user) navigate("/");
	}, [user, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setStatus("Creating admin account...");
		try {
			const res = await fetch(`${API_BASE_URL}/user/adminsignup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("🎉 Account created! Check email for OTP.");
				setShowOtp(true);
			} else {
				toast.error(data.message || "❌ Signup failed.");
			}
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("⚠️ Error creating account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async () => {
		if (!otp) return setStatus("Enter OTP");
		setLoading(true);
		setStatus("Verifying OTP...");
		try {
			const res = await fetch(`${API_BASE_URL}/user/verifyOTP`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: formData.email, otp }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("✅ Email verified! You can now log in.");
				setShowOtp(false);
				setOtp("");
				setFormData({
					username: "",
					email: "",
					password: "",
					adminPassKey: "",
				});
				navigate("/adminlogin");
			} else {
				toast.error(data.message || "❌ Invalid OTP.");
			}
		} catch (error) {
			console.error("OTP verification error:", error);
			toast.error("⚠️ Error verifying OTP.");
		} finally {
			setLoading(false);
		}
	};

	const handleResendOtp = async () => {
		setLoading(true);
		setStatus("Resending OTP...");
		try {
			const res = await fetch(`${API_BASE_URL}/user/resendOTP`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: formData.email }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.success("📩 OTP resent to your email.");
			} else {
				toast.error(data.message || "❌ Error resending OTP.");
			}
		} catch (error) {
			console.error("Resend OTP error:", error);
			toast.error("⚠️ Failed to resend OTP.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-24">
			
			<div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>

			<form
				onSubmit={handleSubmit}
				className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-8 text-gray-100"
			>
				
				<Link
					to="/signup"
					className="absolute top-6 left-6 p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>

				
				<div className="flex justify-center mb-6">
					<div className="p-4 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl">
						<Shield className="w-12 h-12 text-white" />
					</div>
				</div>

				<h2 className="text-3xl font-bold mb-2 text-center bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
					Admin Registration
				</h2>
				<p className="text-center text-gray-400 mb-8">
					Create administrator account
				</p>

				{!showOtp ? (
					<>
						
						<div className="mb-4">
							<label className="block text-sm text-gray-400 mb-2">
								Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Enter your username"
								className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
								required
							/>
						</div>

						
						<div className="mb-4">
							<label className="block text-sm text-gray-400 mb-2">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="admin@example.com"
								className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
								required
							/>
						</div>

						
						<div className="mb-4">
							<label className="block text-sm text-gray-400 mb-2">
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Create a strong password"
								className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
								required
							/>
						</div>

						
						<div className="mb-6">
							<label className="block text-sm text-gray-400 mb-2">
								Admin PassKey
							</label>
							<input
								type="password"
								name="adminPassKey"
								value={formData.adminPassKey}
								onChange={handleChange}
								placeholder="Enter admin passkey"
								className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
								required
							/>
						</div>

						
						<button
							onClick={handleSubmit}
							disabled={loading}
							className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
								loading
									? "bg-linear-to-r from-purple-300 to-pink-300 text-gray-900 cursor-not-allowed"
									: "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl hover:shadow-purple-500/50"
							}`}
						>
							{loading ? "Creating Account..." : "Create Admin Account"}
						</button>
					</>
				) : (
					<div className="mb-6">
						
						<label className="block text-sm text-gray-400 mb-2">
							Enter OTP
						</label>
						<input
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="Enter 6-digit OTP"
							className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
						/>

						
						<button
							onClick={handleVerifyOtp}
							disabled={loading}
							className="mt-4 w-full py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg transition"
						>
							Verify OTP
						</button>

						
						<button
							onClick={handleResendOtp}
							disabled={loading}
							className="mt-3 w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition"
						>
							Resend OTP
						</button>
					</div>
				)}

				
				{status && (
					<p className="mt-4 text-center text-sm text-gray-300">{status}</p>
				)}

				
				<p className="mt-6 text-center text-sm text-gray-400">
					Already have an admin account?{" "}
					<Link
						to="/adminlogin"
						className="text-purple-400 hover:text-purple-300 transition"
					>
						Login
					</Link>
				</p>

				
				<p className="mt-3 text-center text-sm text-gray-500">
					<Link to="/signup" className="hover:text-gray-300 transition">
						← Back to regular signup
					</Link>
				</p>
			</form>
		</div>
	);
};

export default AdminSignUp;
