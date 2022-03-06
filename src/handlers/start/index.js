'use strict';

const startHandler = require('./start');

module.exports = (bot) => {
  bot.start(startHandler);
  bot.action('start', startHandler);
};
