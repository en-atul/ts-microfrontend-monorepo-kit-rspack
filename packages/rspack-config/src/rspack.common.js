import path from 'path';
import { createBaseRspackConfig } from './rspack.base.js';
import { getFilePaths } from './utils.js';

const getCommonConfig = ({ mode,baseUrl, aliases = {} }) => {
	const { __dirname } = getFilePaths(baseUrl);

	const SRC = path.resolve(__dirname, './src');
	const PUBLIC = path.resolve(__dirname, './public');

	const baseConfig = createBaseRspackConfig({
		rootPath: __dirname,
		srcPath: SRC,
		publicPath: PUBLIC,
		aliases,
		mode
	});

	return {
		...baseConfig,
		plugins: [...baseConfig.plugins],
	};
};

export { getCommonConfig };
