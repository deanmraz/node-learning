const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    ...slsw.lib.entries,
  },
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  target: 'node',
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals({})],

  plugins: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
    ],
  },

  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'app'),
    },
    symlinks: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
