const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  mode: 'production',
  entry: [path.join(paths.appPath, 'src/server.ts')],
  target: 'node',
  output: {
    path: paths.appBuild,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.json', '.ts', '.tsx'],
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
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/^pg-native|aws-sdk|.*test.ts(x?)$/)],
};
