const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.build')
  }
};
