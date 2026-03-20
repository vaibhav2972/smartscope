import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-red-400 mb-4">
							Oops! Something went wrong
						</h1>
						<p className="text-gray-400 mb-6">
							We're sorry for the inconvenience. Please try refreshing the page.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
