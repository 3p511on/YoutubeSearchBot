'use strict';

const Markup = require('telegraf/markup');
const { backButton } = require('./back');

const configKeyboard = (i18n) =>
  Markup.inlineKeyboard([[Markup.callbackButton(i18n.t('config.changeCookies'), 'cookies')], [backButton(i18n)]]);

module.exports = { configKeyboard };
