import path from 'path';
import { getFilePaths } from './utils.js';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

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
			clean: true,
		},
		plugins: [
			new ModuleFederationPlugin({
				name: configs.name,
				filename: configs.filename,
				exposes: createExposeEntries(configs.exposes),
				remotes: createRemoteEntries(configs.remotes),
				shared: configs.shared,
			}),
			new rspack.CssExtractRspackPlugin({
				filename: '[name].[contenthash].css',
			}),
			process.env.RSDOCTOR &&
				new RsdoctorRspackPlugin({
					port: 8080,
					mode: 1,
				}),
		],
	};
};
