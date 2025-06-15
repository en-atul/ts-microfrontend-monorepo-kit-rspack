import path from 'path';
import { getRootPath, getPackagePaths, getEnvPaths } from './constants/paths.js';
import { createJavaScriptLoader } from './config/loaders/javascript.js';
import { createStyleLoaders } from './config/loaders/styles.js';
import { createAssetLoaders } from './config/loaders/assets.js';
import { createPlugins } from './config/plugins/index.js';
import { createResolveConfig } from './config/resolve/index.js';

const createBaseRSpackConfig = ({ rootPath, srcPath, publicPath, aliases = {}, mode }) => {
	const ROOT = getRootPath(import.meta.url);
	const PACKAGES = getPackagePaths(ROOT);
	const { dotenvPath, fallbackDotenvPath, nodeEnv } = getEnvPaths(rootPath);
	const isDevelopment = nodeEnv === 'development';

	return {
		entry: path.join(srcPath, 'index.tsx'),
		resolve: createResolveConfig(srcPath, PACKAGES, aliases),
		module: {
			rules: [
				createJavaScriptLoader(srcPath, PACKAGES, isDevelopment),
				...createStyleLoaders(mode),
				...createAssetLoaders(),
			],
		},
		plugins: createPlugins({ publicPath, dotenvPath, fallbackDotenvPath }),
	};
};

export { createBaseRSpackConfig };
