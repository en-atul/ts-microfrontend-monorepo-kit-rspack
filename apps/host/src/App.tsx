import { toCall } from '@repo/utils/pathUtils';
import React, { Suspense, useEffect } from 'react';

import ErrorBoundary from './ErrorBoundary';

const Counter = React.lazy(() => import('remoteApp/Counter'));

const App: React.FC = () => {
	useEffect(() => {
		toCall();
	}, []);

	return (
		<div>
			<h1>🚀 Host App!</h1>
			<ErrorBoundary message="Failed to load Remote 'Counter' component. Please try again later.">
				<Suspense fallback={<div>Loading Counter Component...</div>}>
					<Counter />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default App;
