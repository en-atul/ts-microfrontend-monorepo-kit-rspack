import path from 'path';
import fs from 'fs';
import Dotenv from 'dotenv-webpack';
import { rspack } from '@rspack/core';

export const createPlugins = ({ publicPath, dotenvPath, fallbackDotenvPath }) => [
  new rspack.HtmlRspackPlugin({
    template: path.join(publicPath, 'index.html'),
  }),
  new Dotenv({
    path: fs.existsSync(dotenvPath) ? dotenvPath : fallbackDotenvPath,
  }),
]; 