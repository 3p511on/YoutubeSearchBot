'use strict';

const Markup = require('telegraf/markup');
const { backButton } = require('./back');

const confirmKeyboard = (i18n) =>
  Markup.inlineKeyboard([
    [Markup.callbackButton('✅', 'confirm'), Markup.callbackButton('❌', 'decline')],
    [backButton(i18n, 'settings', 'back.settings')],
  ]);

module.exports = { confirmKeyboard };
