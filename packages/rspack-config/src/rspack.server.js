import path from 'path';
import express from 'express';
import { rspack } from '@rspack/core';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { getConfig } from './rspack.config.js';
import { getFilePaths } from './utils.js';

const start = ({ mode, appName, port, allowedOrigins, ...rest }) => {
	const { __dirname } = getFilePaths(rest.baseUrl);

	const rspackConfig = getConfig(rest);
	const compiler = rspack(rspackConfig);

	const HOST = process.env.HOST || 'localhost';
	const PORT = process.env.PORT || port;
	const PROTOCOL = process.env.PROTOCOL || 'http';

	const isDevelopment = mode === 'development';

	const app = express();

	app.use('/remoteEntry.js', (req, res, next) => {
		const referer = req.get('origin') || req.get('referer');

		if (allowedOrigins.some((origin) => referer && referer.startsWith(origin))) {
			return next();
		}

		res.status(403).send('Forbidden: Referer not allowed');
	});

	app.get('/health', (req, res) => {
		res.send('OK');
	});

	if (isDevelopment) {
		// Webpack middlewares
		app.use(
			webpackDevMiddleware(compiler, {
				publicPath: rspackConfig.output.publicPath,
				stats: 'minimal',
			}),
		);

		// Add hot middleware
		app.use(webpackHotMiddleware(compiler));
	} else {
		// Static file handling for production
		app.use(express.static(path.resolve(__dirname, 'dist')));
	}

	// Handle everything else
	app.get('*', (req, res, next) => {
		if (isDevelopment) {
			const filePath = path.join(compiler.outputPath, 'index.html');
			/**
			 * `compiler.outputFileSystem.readFile` to read the file from Webpack’s 
			 * in-memory filesystem
			 */
			compiler.outputFileSystem.readFile(filePath, (err, result) => {
				if (err) {
					return next(err);
				}
				res.set('content-type', 'text/html');
				res.send(result);
				res.end();
			});
		} else {
			const filePath = path.resolve(__dirname, 'dist', 'index.html');
			res.sendFile(filePath);
		}
	});

	app.listen(PORT, () => {
		console.log(`\n🚀 [\x1b[35m${appName}\x1b[0m] running at ${PROTOCOL}://${HOST}:${PORT}\n`);
	});
};

export { start };
