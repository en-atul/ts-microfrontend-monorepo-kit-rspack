import { merge } from 'webpack-merge';
import { getCommonConfig } from './rspack.common.js';
import devConfig from './rspack.dev.js';
import prodConfig from './rspack.prod.js';

const envConfigMap = {
	development: devConfig,
	production: prodConfig,
};

export const getConfig = ({ mode, baseUrl, aliases, federationConfigs }) => {
	const getEnvConfig = envConfigMap[mode] || devConfig;
	const commonConfig = getCommonConfig({ mode, baseUrl, aliases });
	const envSpecificConfig = getEnvConfig({ baseUrl, configs: federationConfigs });

	return merge(commonConfig, envSpecificConfig);
};
