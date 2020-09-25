const Module = require('module');
const path = require('path');
const chalk = require('chalk');
const MemoryFS = require('memory-fs');
const logcat = require('./logger');

let webpacInstance;
let ProgressPlugin;
let outputfile = 'mock.configs.js';

function Watcher(options, callback) {
  let mfs = new MemoryFS();
  if (!webpacInstance) {
    try {
      webpacInstance = require('webpack');
    } catch (e) {
      console.log('[MOCK] cannot find webpack module.');
    }
  }
  try {
    ProgressPlugin = require('webpack/lib/ProgressPlugin');
  } catch (e) {
    // ignore
  }
  // 监听文件修改重新加载代码
  let compiler = webpacInstance({
    entry: options.entry,
    output: {
      filename: outputfile,
      libraryTarget: 'commonjs2',
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader?sourceType=unambiguous'],
          exclude: /(node_modules|bower_components)/,
        },
      ],
    },
    plugins: ProgressPlugin ? [new ProgressPlugin({})] : [],
  });
  compiler.outputFileSystem = mfs;
  compiler.watch({ aggregateTimeout: options.interval }, function (error, stats) {
    if (error) {
      console.log(chalk.red(error));
      return;
    }
    if (stats.hasErrors()) {
      const errors = stats.compilation ? stats.compilation.errors : null;
      console.log(chalk.red(errors));
      return;
    }
    try {
      // Read each file and compile module
      const { outputPath } = compiler;
      const filepath = path.join(outputPath, outputfile);
      const content = mfs.readFileSync(filepath, 'utf8');
      const outputModule = requireFromString(content, filepath);
      if (outputModule) {
        const mockMap = outputModule.default || outputModule || {};
        logcat.log('refreshing mock service...');
        callback(mockMap);
      }
    } catch (err) {
      console.log(chalk.red(err));
    }
  });
}

Watcher.configWebpack = function (webpack) {
  webpacInstance = webpack;
};

module.exports = Watcher;

function requireFromString(src, filename) {
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}
