export const createResolveConfig = (srcPath, packages, aliases = {}) => ({
  extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
  alias: {
    '@': srcPath,
    '@repo/ui': packages.ui,
    '@repo/utils': packages.utils,
    ...aliases,
  },
}); 