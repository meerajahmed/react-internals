// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../paths');

const config = {
  entry: paths.entry,
  output: {
    publicPath: '/',
    path: paths.output,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
              cache: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.template,
      favicon: paths.favicon,
    }),
  ],
};

module.exports = config;
