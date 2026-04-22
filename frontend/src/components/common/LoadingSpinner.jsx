
import React from "react";

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16",
	};

	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div
				className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}
			></div>
			{text && <p className="mt-4 text-gray-500">{text}</p>}
		</div>
	);
};

export default LoadingSpinner;
