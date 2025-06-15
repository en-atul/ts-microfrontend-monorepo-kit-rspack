import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Utility to calculate __filename and __dirname relative to the importing file.
 * @param importingFileUrl - The URL of the file importing this utility.
 */
function getFilePaths(importingFileUrl) {
	const __filename = fileURLToPath(importingFileUrl);
	const __dirname = path.resolve(path.dirname(__filename));

	return { __filename, __dirname };
}

/**
 * Utility to parse command line arguments
 * @param {string[]} argv - Array of command line arguments
 * @returns {Object} Parsed arguments object
 */
function parseArgs(argv) {
	const argsObject = {};

	argv.forEach((arg) => {
		if (arg.includes('=')) {
			const [key, value] = arg.split('=');
			argsObject[key.slice(2)] = value;
		} else if (arg.startsWith('--')) {
			argsObject[arg.slice(2)] = true;
		}
	});

	return argsObject;
}

export { getFilePaths, parseArgs };
