const MockMiddleware = require('./mock');

module.exports = (api, options) => {
  if (process.env.NODE_ENV === 'development') {
    if (options.pluginOptions && options.pluginOptions.mock) {
      api.configureDevServer(function(app, server) {
        app.use(MockMiddleware(options.pluginOptions.mock));
      });
    } else {
      throw Error('vue-cli-plugin-mock need mock option in vue.config.js pluginOptions');
    }
  }
};
