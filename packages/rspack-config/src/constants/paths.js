import path from 'path';
import { fileURLToPath } from 'url';

export const getRootPath = (importingFileUrl) => {
  const __filename = fileURLToPath(importingFileUrl);
  const __dirname = path.resolve(path.dirname(__filename));
  return path.resolve(__dirname, '../../../');
};

export const getPackagePaths = (rootPath) => ({
  ui: path.join(rootPath, 'packages/ui/src'),
  utils: path.join(rootPath, 'packages/utils/src'),
});

export const getEnvPaths = (rootPath) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envPath = `.env.${nodeEnv}`;
  return {
    dotenvPath: path.resolve(rootPath, envPath),
    fallbackDotenvPath: path.resolve(rootPath, '.env'),
    nodeEnv,
  };
}; 