import { toCall } from '@repo/utils/pathUtils';
import React, { Suspense, useEffect } from 'react';

import ErrorBoundary from './ErrorBoundary';

const RemoteComponent = React.lazy(() => import('remoteApp/RemoteComponent'));

const App: React.FC = () => {
	useEffect(() => {
		toCall();
	}, []);

	return (
		<div>
			<h1>🚀 Host App!</h1>
			<ErrorBoundary message="Failed to load Remote 'Counter' component. Please try again later.">
				<Suspense fallback={<div>Loading Remote Component...</div>}>
					<RemoteComponent />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default App;
