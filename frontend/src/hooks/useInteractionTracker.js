import { useEffect, useRef } from "react";
import { useInteraction } from "@/context/InteractionContext";

export const useInteractionTracker = () => {
	const { trackInteraction } = useInteraction();
	const lastScrollDepth = useRef(0);

	
	const trackClick = (
		elementId,
		elementType,
		elementText,
		additionalData = {},
	) => {
		trackInteraction({
			interactionType: "click",
			actionCategory: "engagement",
			elementId,
			elementType,
			elementText,
			coordinates: {
				x: window.event?.clientX || 0,
				y: window.event?.clientY || 0,
			},
			...additionalData,
		});
	};

	
	const trackPageView = (pageName) => {
		trackInteraction({
			interactionType: "view",
			actionCategory: "navigation",
			pageName,
			pageUrl: window.location.pathname,
		});
	};

	
	const trackScrollDepth = () => {
		const scrollDepth = Math.round(
			(window.scrollY /
				(document.documentElement.scrollHeight - window.innerHeight)) *
				100,
		);

		if (scrollDepth > lastScrollDepth.current + 25) {
			trackInteraction({
				interactionType: "scroll",
				actionCategory: "engagement",
				scrollDepth,
			});
			lastScrollDepth.current = scrollDepth;
		}
	};

	
	const trackItemView = (item) => {
		trackInteraction({
			interactionType: "product_view",
			actionCategory: "engagement",
			entityData: {
				entityType: item.type || "product",
				entityId: item.id,
				entityName: item.name,
				attributes: item.attributes || {},
			},
		});
	};

	
	const trackAddToCart = (item) => {
		trackInteraction({
			interactionType: "add_to_cart",
			actionCategory: "conversion",
			entityData: {
				entityType: "product",
				entityId: item.id,
				entityName: item.name,
				attributes: {
					price: item.price,
					category: item.category,
				},
			},
		});
	};

	
	const trackSearch = (query, resultsCount) => {
		trackInteraction({
			interactionType: "search",
			actionCategory: "navigation",
			searchQuery: query,
			searchResultsCount: resultsCount,
		});
	};

	
	useEffect(() => {
		const handleScroll = () => trackScrollDepth();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return {
		trackClick,
		trackPageView,
		trackScrollDepth,
		trackItemView,
		trackAddToCart,
		trackSearch,
	};
};
