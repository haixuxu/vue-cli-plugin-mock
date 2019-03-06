const Module = require('module');
const path = require('path');
const chalk = require('chalk');
const MemoryFS = require('memory-fs');

let webpacInstance;

function Watcher(options, callback) {
  let mfs = new MemoryFS();
  if (!webpacInstance) {
    try {
      webpacInstance = require('webpack');
    } catch (e) {
      console.log('[MOCK] cannot find webpack module.');
    }
  }
  // 监听文件修改重新加载代码
  let compiler = webpacInstance({
    entry: options.entry,
    output: {
      filename: 'mock.configs.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader?sourceType=unambiguous'],
          exclude: /(node_modules|bower_components)/,
        }],
    },
  });
  compiler.outputFileSystem = mfs;
  compiler.watch({ aggregateTimeout: options.interval },
    function(error, stats) {
      if (error) {
        console.log(chalk.red(error));
        return;
      }
      if (stats.hasErrors()) {
        const errors = stats.compilation ? stats.compilation.errors : null;
        console.log(chalk.red(errors));
        return;
      }
      const { compilation } = stats;
      // Get the list of files.
      const files = Object.keys(compilation.assets);
      // Read each file and compile module
      const { outputPath } = compiler;
      const configs = files.reduce((obj, file) => {
        try {
          // Get the code for the module.
          const filepath = path.join(outputPath, file);
          const src = mfs.readFileSync(filepath, 'utf8');
          const m = new Module();
          m.paths = module.paths;
          // Compile it into a node module!
          m._compile(src, filepath);
          // Add the module to the object.
          obj[file] = m.exports;
        } catch (e) {
          console.log(e);
        }
        return obj;
      }, {});
      const base = compiler.options.output.filename;
      const config = configs[base];
      if (config) {
        const mockMap = config.default || config || {};
        console.log('[MOCK] refresh mock service...');
        callback(mockMap);
      }

    });

}

Watcher.configWebpack = function(webpack) {
  webpacInstance = webpack;
};

module.exports = Watcher;
