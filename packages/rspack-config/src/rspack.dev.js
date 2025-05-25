import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import { getFilePaths } from './utils.js';

export default ({ baseUrl, configs }) => {
	const { __dirname } = getFilePaths(baseUrl);
	const SRC = path.resolve(__dirname, 'src');

	const createRemoteEntries = (remotes) =>
		Object.fromEntries(
			Object.entries(remotes).map(([key, url]) => [key, `${key}@${url}`])
		);

	const createExposeEntries = (exposes) =>
		Object.fromEntries(
			Object.entries(exposes).map(([key, relativePath]) => [key, path.join(SRC, relativePath)])
		);

	return {
		mode: 'development',
		devtool: 'cheap-module-source-map',
		entry: {
			main: ['webpack-hot-middleware/client', path.resolve(SRC, 'index.tsx')],
		},
		output: {
			publicPath: configs.publicPath,
		},
		plugins: [
			new ModuleFederationPlugin({
				name: configs.name,
				filename: configs.filename,
				exposes: createExposeEntries(configs.exposes),
				remotes: createRemoteEntries(configs.remotes),
				shared: configs.shared,
			}),
			new ReactRefreshWebpackPlugin(),
			new webpack.HotModuleReplacementPlugin(),
		],
	};
};
