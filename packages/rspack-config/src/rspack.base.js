import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import { getFilePaths } from './utils.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const { __dirname } = getFilePaths(import.meta.url);

const createBaseRspackConfig = ({ rootPath, srcPath, publicPath, aliases = {}, mode }) => {
	const ROOT = path.resolve(__dirname, '../../../');

	const PACKAGES = {
		ui: path.join(ROOT, 'packages/ui/src'),
		utils: path.join(ROOT, 'packages/utils/src'),
	};

	const babelConfigPath = path.join(ROOT, 'packages/babel-config/index.js');

	// Load environment variables
	const nodeEnv = process.env.NODE_ENV || 'development';
	const envPath = `.env.${nodeEnv}`;
	const dotenvPath = path.resolve(rootPath, envPath);
	const fallbackDotenvPath = path.resolve(rootPath, '.env');

	const styleLoader = mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';

	return {
		entry: path.join(srcPath, 'index.tsx'),

		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
			alias: {
				'@': srcPath,
				'@repo/ui': PACKAGES.ui,
				'@repo/utils': PACKAGES.utils,
				...aliases,
			},
		},

		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					include: [srcPath, ...Object.values(PACKAGES)],
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							configFile: babelConfigPath,
						},
					},
				},
				{
					test: /\.module\.scss$/,
					use: [
						styleLoader,
						{
							loader: 'css-loader',
							options: {
								modules: {
									localIdentName:
										mode === 'production' ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
								},
								importLoaders: 1,
							},
						},
						'sass-loader',
					],
				},
				{
					test: /\.s[ac]ss$/i,
					exclude: /\.module\.(scss|sass)$/,
					use: [
						styleLoader,
						{
							loader: 'css-loader',
							options: { importLoaders: 1 },
						},
						'sass-loader',
					],
				},
				{
					test: /\.css$/,
					use: [
						styleLoader,
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
							},
						},
					],
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg)$/,
					type: 'asset',
				},
				{
					test: /\.(woff(2)?|eot|ttf|otf)$/,
					type: 'asset/resource',
				},
			],
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(publicPath, 'index.html'),
			}),
			new Dotenv({
				path: fs.existsSync(dotenvPath) ? dotenvPath : fallbackDotenvPath,
			}),
		],
	};
};

export { createBaseRspackConfig };
