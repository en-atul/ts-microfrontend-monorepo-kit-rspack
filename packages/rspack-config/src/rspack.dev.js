import path from 'path';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { getFilePaths } from './utils.js';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';

export default ({ baseUrl, configs }) => {
	const { __dirname } = getFilePaths(baseUrl);
	const SRC = path.resolve(__dirname, 'src');

	const createRemoteEntries = (remotes) =>
		Object.fromEntries(Object.entries(remotes).map(([key, url]) => [key, `${key}@${url}`]));

	const createExposeEntries = (exposes) =>
		Object.fromEntries(
			Object.entries(exposes).map(([key, relativePath]) => [key, path.join(SRC, relativePath)]),
		);

	return {
		mode: 'development',
		devtool: 'cheap-module-source-map',
		entry: {
			main: ['webpack-hot-middleware/client', path.resolve(SRC, 'index.tsx')],
		},
		output: {
			publicPath: configs.publicPath,
			hotUpdateChunkFilename: '[id].[fullhash].hot-update.js',
			hotUpdateMainFilename: '[runtime].[fullhash].hot-update.json'
		},
		plugins: [
			new ModuleFederationPlugin({
				name: configs.name,
				filename: configs.filename,
				shared: configs.shared,
				exposes: createExposeEntries(configs.exposes),
				remotes: createRemoteEntries(configs.remotes),
			}),
			new ReactRefreshPlugin(),
			new rspack.HotModuleReplacementPlugin(),
		],
	};
};
