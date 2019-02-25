const chalk = require('chalk');
module.exports = console.log.bind(console, chalk.blue('[MOCK] '));
