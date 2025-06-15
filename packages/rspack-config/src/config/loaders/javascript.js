export const createJavaScriptLoader = (srcPath, packages, isDevelopment) => ({
  test: /\.[jt]sx?$/,
  include: [srcPath, ...Object.values(packages)],
  exclude: /node_modules/,
  loader: 'builtin:swc-loader',
  options: {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
          refresh: isDevelopment,
        },
      },
      target: 'es2022',
    },
  },
}); 