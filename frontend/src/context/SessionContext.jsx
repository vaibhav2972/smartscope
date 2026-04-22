import React, { createContext, useContext, useState, useEffect } from "react";
import { sessionService } from "@/services/sessionService";
import { useAuth } from "./AuthContext";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
	const { user } = useAuth();
	const [currentSession, setCurrentSession] = useState(null);
	const [loading, setLoading] = useState(false);

	const startSession = async (websiteId) => {
		if (!user) return;

		try {
			setLoading(true);
			const deviceInfo = {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				screenResolution: `${window.screen.width}x${window.screen.height}`,
			};

			const sessionData = {
				websiteId,
				deviceInfo,
				ipAddress: "auto", 
				location: {
					country: "India", 
					city: "Delhi",
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
				referralSource: document.referrer || "direct",
			};

			const response = await sessionService.startSession(sessionData);
			setCurrentSession(response.data);
			return response.data;
		} catch (error) {
			console.error("Error starting session:", error);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const endSession = async (exitPage) => {
		if (!currentSession) return;

		try {
			await sessionService.endSession(currentSession._id, {
				exitPage: exitPage || window.location.pathname,
				exitIntent: false,
			});
			setCurrentSession(null);
		} catch (error) {
			console.error("Error ending session:", error);
		}
	};

	const updateSessionMetrics = async (metricsData) => {
		if (!currentSession) return;

		try {
			await sessionService.updateSession(currentSession._id, metricsData);
		} catch (error) {
			console.error("Error updating session:", error);
		}
	};

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (currentSession) {
				endSession();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [currentSession]);

	return (
		<SessionContext.Provider
			value={{
				currentSession,
				startSession,
				endSession,
				updateSessionMetrics,
				loading,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => useContext(SessionContext);
