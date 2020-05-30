const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const paths = require('../paths');

const config = {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
  },
  devServer: {
    contentBase: paths.output,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
    new Dotenv({
      path: paths.devEnv,
      systemvars: true,
      defaults: true,
    }),
  ],
};

module.exports = config;
