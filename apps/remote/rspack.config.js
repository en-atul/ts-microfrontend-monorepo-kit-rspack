import pc from 'picocolors';
import { createRequire } from 'module';
import { start } from '@repo/rspack-config/server';
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const { dependencies: deps } = require('./package.json');

const port = 3001;

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

const isBuildServing = args.serve === 'true';
const isDevServing = mode === 'development';

// Base configuration
const baseFederationConfig = {
	name: 'remoteApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./Counter': 'Counter.tsx',
	},
	shared: {
		...deps,
		react: { singleton: true, eager: true, requiredVersion: deps.react },
		'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
	},
};

// Environment-specific settings (overrides for each environment)
const getEnvironmentConfig = (env) => {
	switch (env) {
		case 'development':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {
					hostApp: 'http://localhost:3000/remoteEntry.js',
				},
				allowedOrigins: ['http://localhost:3000/'],
			};

		case 'staging':
			return {
				publicPath: `http://staging.example.com/`,
				remotes: {},
				allowedOrigins: [`http://marketting.staging.example.com/`],
			};

		case 'production':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ['http://localhost:3000/'],
			};

		default:
			// Fallback to development as default environment
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ['http://localhost:3000/'],
			};
	}
};

// Get the specific environment config
const environmentConfig = getEnvironmentConfig(process.env.NODE_ENV);

// Combine base and environment-specific configs
const federationConfigs = {
	...baseFederationConfig,
	...environmentConfig,
};

let config;

// Serve the local build using the Webpack server or run in development mode
if (isBuildServing || isDevServing) {
	// Start the Webpack server
	config = start({
		appName: 'Remote App',
		baseUrl: moduleUrl,
		federationConfigs,
		allowedOrigins: federationConfigs.allowedOrigins,
		port,
		mode,
	});
} else {
	console.log(pc.gray(`[Build]: ${pc.magenta(mode)}`));

	config = getConfig({
		baseUrl: moduleUrl,
		federationConfigs,
		mode,
	});
}

export default config;
