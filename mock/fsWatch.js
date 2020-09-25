const fs = require('fs');
const chalk = require('chalk');
const logcat = require('./logger');
/**
 * use fs.watchFile
 */
module.exports = function (options, callback) {
  logcat.log('watch mock file:' + options.entry);
  requireFile(options.entry).then(callback);
  //watch file change to create route map
  fs.watchFile(options.entry, { interval: options.interval }, function () {
    requireFile(options.entry).then(callback);
  });
};

function requireFile(watchFile) {
  return new Promise(function (resolve, reject) {
    logcat.log('refresh watch file...');
    try {
      delete require.cache[require.resolve(watchFile)];
      const mockModule = require(watchFile);
      resolve(mockModule);
    } catch (err) {
      logcat.log('Done: Hot Mocker file replacement failed!\n' + chalk.red(err.stack));
      reject(err);
    }
  });
}
