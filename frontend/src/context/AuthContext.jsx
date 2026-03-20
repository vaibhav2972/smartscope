import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchUser = async () => {
		try {
			const data = await authService.getProfile();
			setUser(data.user);
		} catch (err) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const logout = async () => {
		try {
			await authService.logout();
			navigate("/");
		} catch (err) {
			console.error("Logout error:", err);
		}
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, loading, logout, fetchUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
