import React, { createContext, useContext, useRef, useEffect } from "react";
import { interactionService } from "@/services/interactionService";
import { useSession } from "./SessionContext";

const InteractionContext = createContext();

export const InteractionProvider = ({ children, websiteId }) => {
	const { currentSession } = useSession();
	const interactionQueue = useRef([]);
	const flushInterval = useRef(null);

	
	const trackInteraction = (interactionData) => {
		if (!currentSession || !websiteId) return;

		const interaction = {
			sessionId: currentSession._id,
			websiteId,
			timestamp: new Date().toISOString(),
			pageUrl: window.location.pathname,
			viewportSize: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			...interactionData,
		};

		interactionQueue.current.push(interaction);

		
		if (interactionQueue.current.length >= 10) {
			flushInteractions();
		}
	};

	
	const flushInteractions = async () => {
		if (interactionQueue.current.length === 0) return;

		const interactions = [...interactionQueue.current];
		interactionQueue.current = [];

		try {
			await interactionService.trackBulkInteractions(interactions);
		} catch (error) {
			console.error("Error flushing interactions:", error);
			
			interactionQueue.current.unshift(...interactions);
		}
	};

	
	useEffect(() => {
		flushInterval.current = setInterval(flushInteractions, 5000);

		return () => {
			if (flushInterval.current) {
				clearInterval(flushInterval.current);
			}
			flushInteractions(); 
		};
	}, []);

	return (
		<InteractionContext.Provider
			value={{ trackInteraction, flushInteractions }}
		>
			{children}
		</InteractionContext.Provider>
	);
};

export const useInteraction = () => useContext(InteractionContext);
