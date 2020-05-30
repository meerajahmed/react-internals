const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const paths = require('../paths');

const config = {
  mode: 'production',
  output: {
    filename: '[id].[hash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
    }),
    new Dotenv({
      path: paths.prodEnv,
      systemvars: true,
      defaults: true,
    }),
  ],
};
module.exports = config;
