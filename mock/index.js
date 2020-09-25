const path = require('path');
const chalk = require('chalk');
const apiMocker = require('express-mock-restful');
let fsWatch = require('./fsWatch');
let logcat = require('./logger');
let webpackWatch = require('./webpackWatch');
let isDebug = false;

module.exports = function (options, useWebpack) {
  options = options || {};
  let entry = options.entry || './mock/index.js';
  isDebug = options.debug;

  if (path.isAbsolute(entry) === false) {
    entry = path.resolve(process.cwd(), entry);
  }
  let watchConfig = { entry: entry, interval: options.interval || 200 };

  if (useWebpack) {
    isDebug && logcat.debug('use webpack watch mock file.');
    webpackWatch(watchConfig, refreshMock);
  } else {
    isDebug && logcat.debug('use fs watchFile mock file.');
    fsWatch(watchConfig, refreshMock);
  }

  return apiMocker({}, mocklogFn);

  function refreshMock(mockObj) {
    apiMocker.refresh(mockObj);
    logcat.log('Done: Hot Mocker file replacement success!');
  }

  function mocklogFn(type, msg) {
    if (type === 'matched') {
      logcat.log(type + ' ' + msg);
    } else {
      isDebug && logcat.debug(type + ' ' + msg);
    }
  }
};
