

import React from "react";

const Badge = ({ children, variant = "default", size = "md" }) => {
	const variantClasses = {
		default: "bg-gray-100 text-gray-700",
		primary: "bg-blue-100 text-blue-700",
		success: "bg-green-100 text-green-700",
		warning: "bg-yellow-100 text-yellow-700",
		danger: "bg-red-100 text-red-700",
		purple: "bg-purple-100 text-purple-700",
	};

	const sizeClasses = {
		sm: "px-2 py-0.5 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-1.5 text-base",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
		>
			{children}
		</span>
	);
};

export default Badge;
