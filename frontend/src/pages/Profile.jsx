import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { sessionService } from "@/services/sessionService";
import { interactionService } from "@/services/interactionService";
import {
	User,
	Mail,
	Calendar,
	Activity,
	Clock,
	MousePointer,
	Eye,
	BarChart3,
	Edit2,
	Camera,
	Lock,
	Trash2,
	X,
	Save,
} from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";

const Profile = () => {
	const { user, setUser, loading: authLoading, logout } = useAuth();
	const navigate = useNavigate();

	const [stats, setStats] = useState(null);
	const [recentSessions, setRecentSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		avatar: "",
	});

	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				username: user.username || "",
				email: user.email || "",
				avatar: user.avatar || "",
			});
			fetchUserStats();
			fetchRecentSessions();
		}
	}, [user]);

	const fetchUserStats = async () => {
		try {
			const [interactionStats, sessionStats] = await Promise.all([
				interactionService.getInteractionStats(),
				sessionService.getUserSessions({ limit: 5 }),
			]);

			setStats({
				totalInteractions: interactionStats.data?.total || 0,
				interactionsByType: interactionStats.data?.byType || [],
				totalSessions: sessionStats.data?.length || 0,
				avgSessionDuration: sessionStats.stats?.avgDuration || 0,
			});
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchRecentSessions = async () => {
		try {
			const response = await sessionService.getUserSessions({ limit: 5 });
			setRecentSessions(response.data || []);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		}
	};

	const handleEdit = () => {
		setEditMode(!editMode);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			const response = await authService.updateProfile({
				username: formData.username,
				avatar: formData.avatar,
			});

			if (response.user) {
				setUser(response.user);
				toast.success("Profile updated successfully!");
				setEditMode(false);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error(error.response?.data?.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = async () => {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (passwordData.newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		try {
			setLoading(true);
			await authService.changePassword({
				oldPassword: passwordData.oldPassword,
				newPassword: passwordData.newPassword,
			});

			toast.success("Password changed successfully!");
			setShowPasswordModal(false);
			setPasswordData({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.error("Error changing password:", error);
			toast.error(error.response?.data?.message || "Failed to change password");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			setLoading(true);
			await authService.deleteAccount();
			toast.success("Account deleted successfully");
			await logout();
			navigate("/");
		} catch (error) {
			console.error("Error deleting account:", error);
			toast.error(error.response?.data?.message || "Failed to delete account");
		} finally {
			setLoading(false);
		}
	};

	const formatDuration = (seconds) => {
		if (!seconds) return "0s";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center pt-20">
				<Loader />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-950 flex items-center justify-center pt-20">
				<p className="text-gray-400">Please log in to view your profile</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
						Your Profile
					</h1>
					<p className="text-gray-400 text-lg">
						View your activity and manage your account
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					
					<div className="lg:col-span-1">
						<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sticky top-24">
							
							<div className="relative mb-6">
								<div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/20 bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
									{formData.avatar ? (
										<img
											src={formData.avatar}
											alt={formData.username}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-5xl font-bold text-white">
											{formData.username?.charAt(0).toUpperCase()}
										</span>
									)}
								</div>
								
							</div>

							
							{editMode ? (
								<div className="space-y-4 mb-6">
									<div>
										<label className="block text-sm text-gray-400 mb-2">
											Username
										</label>
										<input
											type="text"
											value={formData.username}
											onChange={(e) =>
												setFormData({ ...formData, username: e.target.value })
											}
											className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl outline-none focus:border-cyan-500 transition"
										/>
									</div>
									<div>
										<label className="block text-sm text-gray-400 mb-2">
											Avatar URL
										</label>
										<input
											type="text"
											value={formData.avatar}
											onChange={(e) =>
												setFormData({ ...formData, avatar: e.target.value })
											}
											placeholder="https://example.com/avatar.jpg"
											className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl outline-none focus:border-cyan-500 transition"
										/>
									</div>
								</div>
							) : (
								<div className="text-center mb-6">
									<h2 className="text-2xl font-bold text-white mb-2">
										{user.username}
									</h2>
									<p className="text-gray-400 mb-1">{user.email}</p>
									<span
										className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
											user.role === "admin"
												? "bg-purple-900/30 text-purple-400"
												: "bg-blue-900/30 text-blue-400"
										}`}
									>
										{user.role}
									</span>
								</div>
							)}

							
							<div className="space-y-3">
								{editMode ? (
									<>
										<button
											onClick={handleSave}
											disabled={loading}
											className="w-full py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
										>
											<Save className="w-4 h-4" />
											Save Changes
										</button>
										<button
											onClick={() => {
												setEditMode(false);
												setFormData({
													username: user.username || "",
													email: user.email || "",
													avatar: user.avatar || "",
												});
											}}
											className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold"
										>
											Cancel
										</button>
									</>
								) : (
									<>
										<button
											onClick={handleEdit}
											className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2"
										>
											<Edit2 className="w-4 h-4" />
											Edit Profile
										</button>
										<button
											onClick={() => setShowPasswordModal(true)}
											className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2"
										>
											<Lock className="w-4 h-4" />
											Change Password
										</button>
										<button
											onClick={() => setShowDeleteModal(true)}
											className="w-full py-3 bg-red-900/30 text-red-400 rounded-xl hover:bg-red-900/50 transition font-semibold flex items-center justify-center gap-2"
										>
											<Trash2 className="w-4 h-4" />
											Delete Account
										</button>
									</>
								)}
							</div>

							
							<div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
								<div className="flex items-center gap-3 text-sm">
									<Calendar className="w-4 h-4 text-gray-500" />
									<span className="text-gray-400">
										Joined{" "}
										{new Date(user.createdAt).toLocaleDateString("en-US", {
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<Mail className="w-4 h-4 text-gray-500" />
									<span className="text-gray-400">
										{user.verified ? (
											<span className="text-green-400">✓ Verified</span>
										) : (
											<span className="text-yellow-400">Not verified</span>
										)}
									</span>
								</div>
							</div>
						</div>
					</div>

					
					<div className="lg:col-span-2 space-y-8">
						
						<div className="grid sm:grid-cols-2 gap-6">
							<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-cyan-900/30 rounded-xl">
										<MousePointer className="w-6 h-6 text-cyan-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm">Total Interactions</p>
										<p className="text-3xl font-bold text-white">
											{stats?.totalInteractions || 0}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-purple-900/30 rounded-xl">
										<Activity className="w-6 h-6 text-purple-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm">Sessions</p>
										<p className="text-3xl font-bold text-white">
											{stats?.totalSessions || 0}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-blue-900/30 rounded-xl">
										<Clock className="w-6 h-6 text-blue-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm">Avg Session</p>
										<p className="text-3xl font-bold text-white">
											{formatDuration(
												Math.round(stats?.avgSessionDuration || 0),
											)}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
								<div className="flex items-center gap-4">
									<div className="p-3 bg-green-900/30 rounded-xl">
										<BarChart3 className="w-6 h-6 text-green-400" />
									</div>
									<div>
										<p className="text-gray-400 text-sm">Activity Types</p>
										<p className="text-3xl font-bold text-white">
											{stats?.interactionsByType?.length || 0}
										</p>
									</div>
								</div>
							</div>
						</div>

						
						<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
							<h3 className="text-xl font-bold text-white mb-6">
								Activity Breakdown
							</h3>
							<div className="space-y-4">
								{stats?.interactionsByType?.slice(0, 5).map((item, index) => {
									const total = stats.totalInteractions;
									const percentage =
										total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
									return (
										<div key={index}>
											<div className="flex items-center justify-between mb-2">
												<span className="text-gray-400 capitalize">
													{item._id.replace("_", " ")}
												</span>
												<span className="text-white font-semibold">
													{item.count}
												</span>
											</div>
											<div className="w-full bg-gray-800 rounded-full h-2">
												<div
													className="bg-linear-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
													style={{ width: `${percentage}%` }}
												></div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						
						<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
							<h3 className="text-xl font-bold text-white mb-6">
								Recent Sessions
							</h3>
							<div className="space-y-4">
								{recentSessions.length > 0 ? (
									recentSessions.map((session, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition"
										>
											<div className="flex items-center gap-4">
												<div className="p-3 bg-purple-900/30 rounded-xl">
													<Eye className="w-5 h-5 text-purple-400" />
												</div>
												<div>
													<p className="text-white font-semibold">
														{session.websiteId?.name || "Unknown Website"}
													</p>
													<p className="text-sm text-gray-500">
														{new Date(
															session.sessionStart,
														).toLocaleDateString()}{" "}
														at{" "}
														{new Date(
															session.sessionStart,
														).toLocaleTimeString()}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-white font-semibold">
													{formatDuration(session.duration)}
												</p>
												<p className="text-sm text-gray-500">
													{session.totalInteractions} interactions
												</p>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500 text-center py-8">
										No recent sessions
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			
			{showPasswordModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
					<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold text-white">Change Password</h3>
							<button
								onClick={() => {
									setShowPasswordModal(false);
									setPasswordData({
										oldPassword: "",
										newPassword: "",
										confirmPassword: "",
									});
								}}
								className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm text-gray-400 mb-2">
									Current Password
								</label>
								<input
									type="password"
									value={passwordData.oldPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											oldPassword: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl outline-none focus:border-cyan-500 transition"
									placeholder="Enter current password"
								/>
							</div>

							<div>
								<label className="block text-sm text-gray-400 mb-2">
									New Password
								</label>
								<input
									type="password"
									value={passwordData.newPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											newPassword: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl outline-none focus:border-cyan-500 transition"
									placeholder="Enter new password"
								/>
							</div>

							<div>
								<label className="block text-sm text-gray-400 mb-2">
									Confirm New Password
								</label>
								<input
									type="password"
									value={passwordData.confirmPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											confirmPassword: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl outline-none focus:border-cyan-500 transition"
									placeholder="Confirm new password"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									onClick={handleChangePassword}
									disabled={
										loading ||
										!passwordData.oldPassword ||
										!passwordData.newPassword
									}
									className="flex-1 py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
								>
									{loading ? "Changing..." : "Change Password"}
								</button>
								<button
									onClick={() => {
										setShowPasswordModal(false);
										setPasswordData({
											oldPassword: "",
											newPassword: "",
											confirmPassword: "",
										});
									}}
									className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			
			{showDeleteModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
					<div className="bg-gray-900 border border-red-800 rounded-2xl p-8 max-w-md w-full">
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<Trash2 className="w-8 h-8 text-red-400" />
							</div>
							<h3 className="text-2xl font-bold text-white mb-2">
								Delete Account?
							</h3>
							<p className="text-gray-400">
								This action cannot be undone. All your data will be permanently
								deleted.
							</p>
						</div>

						<div className="flex gap-3">
							<button
								onClick={handleDeleteAccount}
								disabled={loading}
								className="flex-1 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition font-semibold disabled:opacity-50"
							>
								{loading ? "Deleting..." : "Yes, Delete"}
							</button>
							<button
								onClick={() => setShowDeleteModal(false)}
								className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition font-semibold"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
