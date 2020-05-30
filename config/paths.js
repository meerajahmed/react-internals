const path = require('path');

const config = {
  entry: './src/index.js',
  output: path.resolve(__dirname, '..', 'dist'),
  template: './src/index.html',
  favicon: './src/static/icons/favicon.ico',
  mocks: path.resolve(__dirname, '..', 'src', 'mocks'),
  devEnv: path.resolve(__dirname, '..', '.env.development'),
  prodEnv: path.resolve(__dirname, '..', '.env.production'),
};

module.exports = config;
