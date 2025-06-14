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
		entry: path.resolve(SRC, 'index.tsx'),

		output: {
			publicPath: configs.publicPath,
		},
		// devServer: {
		// 	hot: true,
		// 	port: 3000, // or customize per app
		// 	historyApiFallback: true,
		// },
		plugins: [
			// new rspack.container.ModuleFederationPlugin({
			// 	name: configs.name,
			// 	filename: configs.filename,
			// 	exposes: createExposeEntries(configs.exposes),
			// 	remotes: createRemoteEntries(configs.remotes),
			// 	shared: configs.shared,
			// }),
			new ModuleFederationPlugin({
				name: configs.name,
				filename: configs.filename,
				exposes: createExposeEntries(configs.exposes),
				remotes: createRemoteEntries(configs.remotes),
				shared: configs.shared,
			}),
			new ReactRefreshPlugin(),
			new rspack.HotModuleReplacementPlugin(),
		],
	};
};
