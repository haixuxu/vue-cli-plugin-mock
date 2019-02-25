const Module = require('module');
const path = require('path');
const chalk = require('chalk');
const MemoryFS = require('memory-fs');

module.exports = function(options, callback) {
  let mfs = new MemoryFS();
  try {
    // 监听文件修改重新加载代码
    let compiler = require('webpack')({
      entry: options.entry,
      output: {
        filename: 'mock.configs.js',
        libraryTarget: 'commonjs2',
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /(node_modules|bower_components)/,
          }],
      },
    });
    compiler.outputFileSystem = mfs;

    compiler.watch({aggregateTimeout: options.interval},
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
        const {compilation} = stats;
        // Get the list of files.
        const files = Object.keys(compilation.assets);
        // Read each file and compile module
        const {outputPath} = compiler;
        const configs = files.reduce((obj, file) => {
          // Get the code for the module.
          const filepath = path.join(outputPath, file);
          const src = mfs.readFileSync(filepath, 'utf8');
          const m = new Module();
          m.paths = module.paths;
          // Compile it into a node module!
          m._compile(src, filepath);
          // Add the module to the object.
          obj[file] = m.exports;
          return obj;
        }, {});
        const base = compiler.options.output.filename;
        const config = configs[base];
        const mockMap = config.default || {};
        callback(mockMap);
        console.log('[MOCK] refresh mock service...');
      });
  } catch (e) {
    console.log('cannot find webpack module.');
  }

};
