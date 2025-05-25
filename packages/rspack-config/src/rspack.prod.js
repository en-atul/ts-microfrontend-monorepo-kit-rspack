import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import { getFilePaths } from './utils.js';

export default ({ baseUrl, configs }) => {
	const { __dirname } = getFilePaths(baseUrl);
	const SRC = path.join(__dirname, 'src');

	const createRemoteEntries = (remotes) =>
		Object.fromEntries(Object.entries(remotes).map(([key, url]) => [key, `${key}@${url}`]));

	const createExposeEntries = (exposes) =>
		Object.fromEntries(
			Object.entries(exposes).map(([key, relativePath]) => [key, path.join(SRC, relativePath)]),
		);

	return {
		mode: 'production',
		devtool: 'source-map',
		output: {
			filename: '[name].[contenthash].js',
			path: __dirname + '/dist',
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
			new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
			new CleanWebpackPlugin(),
		],
	};
};
