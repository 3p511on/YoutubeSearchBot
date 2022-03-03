'use strict';

const { Markup } = require('telegraf');
const { backButton } = require('./back');

const videoInfoKeyboard = (i18n) =>
  Markup.inlineKeyboard([[Markup.callbackButton(i18n.t('findVideo.subscribe'), 'subscribe')], [backButton(i18n)]]);

module.exports = { videoInfoKeyboard };
