export const createAssetLoaders = () => [
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    type: 'asset',
  },
  {
    test: /\.(woff(2)?|eot|ttf|otf)$/,
    type: 'asset/resource',
  },
]; 