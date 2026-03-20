import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { Shield, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		adminPassKey: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setUser, user } = useAuth();
	const statusRef = useRef(null);

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

		try {
			const res = await fetch(`${API_BASE_URL}/user/adminlogin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success("🎉 Admin login successful!");
				setUser(data.user);
				setTimeout(() => navigate("/"), 1000);
			} else {
				toast.error(data.message || "Invalid credentials.");
			}
		} catch (err) {
			console.error("Login error:", err);
			toast.error("Something went wrong. Please try again.");
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
				aria-describedby="statusMessage"
			>
				
				<Link
					to="/login"
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
					Admin Access
				</h2>
				<p className="text-center text-gray-400 mb-8">
					Secure administrator login
				</p>

				
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm text-gray-400 mb-2">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="admin@example.com"
						autoComplete="email"
						className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
						required
						autoFocus
					/>
				</div>

				
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm text-gray-400 mb-2"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Enter your password"
						autoComplete="current-password"
						className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 transition"
						required
					/>
				</div>

				
				<div className="mb-6">
					<label
						htmlFor="adminPassKey"
						className="block text-sm text-gray-400 mb-2"
					>
						Admin PassKey
					</label>
					<input
						id="adminPassKey"
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
					type="submit"
					disabled={loading}
					className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
						loading
							? "bg-linear-to-r from-purple-300 to-pink-300 text-gray-900 cursor-not-allowed"
							: "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl hover:shadow-purple-500/50"
					}`}
				>
					{loading ? "Logging in..." : "Admin Login"}
				</button>

				
				<p
					id="statusMessage"
					ref={statusRef}
					className="sr-only"
					aria-live="polite"
				>
					{loading ? "Logging in..." : ""}
				</p>

				
				<p className="mt-6 text-center text-sm text-gray-400">
					Need admin access?{" "}
					<Link
						to="/adminsignup"
						className="text-purple-400 hover:text-purple-300 transition"
					>
						Request Account
					</Link>
				</p>

				
				<p className="mt-3 text-center text-sm text-gray-500">
					<Link to="/login" className="hover:text-gray-300 transition">
						← Back to regular login
					</Link>
				</p>
			</form>
		</div>
	);
};

export default AdminLogin;
