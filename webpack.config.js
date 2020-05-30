const webpackMerge = require('webpack-merge');
const baseConfig = require('./config/webpack/base');

const webpackConfig = (env) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const envConfig = require(`./config/webpack/${env.mode}`);
  return webpackMerge(baseConfig, envConfig);
};

module.exports = webpackConfig;
