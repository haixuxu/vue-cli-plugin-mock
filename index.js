const MockMiddleware = require('./mock');
const webpackWatch = require('./mock/webpackWatch');

module.exports = (api, options) => {
  if (process.env.NODE_ENV === 'development') {
    const webpack = require(api.resolve('node_modules/webpack'));
    webpackWatch.configWebpack(webpack);
    if (options.pluginOptions && options.pluginOptions.mock) {
      api.configureDevServer(function(app, server) {
        app.use(MockMiddleware(options.pluginOptions.mock, true));
      });
    } else {
      throw Error('vue-cli-plugin-mock need mock option in vue.config.js pluginOptions');
    }
  }
};
