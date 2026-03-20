import React from "react";
import { Zap } from "lucide-react";

const Loader = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
				<div className="absolute inset-0 flex items-center justify-center">
					<Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
				</div>
			</div>
			<div className="text-center">
				<p className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 font-semibold animate-pulse">
					SmartScope
				</p>
			</div>
		</div>
	);
};

export default Loader;
