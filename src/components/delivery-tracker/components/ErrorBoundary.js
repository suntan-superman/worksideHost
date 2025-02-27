/* eslint-disable */
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
		console.error("DeliveryTracker Error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: "20px", color: "red" }}>
					<h1>Something went wrong.</h1>
					<pre>{this.state.error?.message}</pre>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
