const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: [path.join(paths.appPath, 'src/server.ts')],
  target: 'node',
  output: {
    path: paths.appBuild,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: ['node_modules'],
  },

  optimization: {
    minimize: false,
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [new UnusedFilesWebpackPlugin({})],
};
