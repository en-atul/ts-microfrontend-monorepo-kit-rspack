import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<
	{ children: ReactNode; message?: string },
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = {
		hasError: false,
		error: null,
	};

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ color: 'red', padding: '20px' }}>
					{this.props.message || 'Something went wrong. Please try again later.'}
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
