var slsw          = require('serverless-webpack');
var nodeExternals = require('webpack-node-externals');
var path = require('path');
var fs = require('fs');

console.log(slsw.lib.entries);

module.exports = {
  entry: {
    ...slsw.lib.entries,
  },
  mode: slsw.lib.webpack.isLocal ? 'development': 'production',
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  target: 'node',
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals({
  })],

  plugins: [

  ],

  module: {
    rules: [

    ]
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'app'),
    },
    symlinks: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
