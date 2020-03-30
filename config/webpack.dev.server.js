const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  mode: 'development',
  entry: ['webpack/hot/poll?1000', path.join(paths.appPath, 'src/server.ts')],
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
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.server.json',
            },
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackShellPlugin({ onBuildEnd: [`node ${paths.appBuild}/server.js`] }),
  ],
  watch: true,
};
