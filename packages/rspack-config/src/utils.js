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

function parseArgs(argv) {
	const argsObject = {};

	// Iterate through each argument
	argv.forEach((arg) => {
		// Check if the argument is in --key=value format
		if (arg.includes('=')) {
			const [key, value] = arg.split('=');
			argsObject[key.slice(2)] = value; // Remove the '--' prefix and assign the value
		} else if (arg.startsWith('--')) {
			// Handle flags with no value (e.g., --debug)
			argsObject[arg.slice(2)] = true; // Treat flag as true
		}
	});

	return argsObject;
}

export { getFilePaths, parseArgs };
