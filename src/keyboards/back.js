'use strict';

const Markup = require('telegraf/markup');

const backButton = (i18n, action = 'start', phrase = 'back.button') => Markup.callbackButton(i18n.t(phrase), action);

const backKeyboard = (i18n, ...args) => Markup.inlineKeyboard([backButton(i18n, ...args)]);

const sceneRepeatKeyboard = (i18n, ...args) =>
  Markup.inlineKeyboard([[Markup.callbackButton(i18n.t('back.repeat'), 'repeat')], [backButton(i18n, ...args)]]);

module.exports = { backButton, backKeyboard, sceneRepeatKeyboard };
