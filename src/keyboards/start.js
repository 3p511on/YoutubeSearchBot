'use strict';

const Markup = require('telegraf/markup');

const startKeyboard = (i18n) =>
  Markup.inlineKeyboard([
    [Markup.callbackButton(i18n.t('start.featured'), 'featured')],
    [
      Markup.callbackButton(i18n.t('start.findVideo'), 'findvideo'),
      Markup.callbackButton(i18n.t('start.settings'), 'settings'),
    ],
  ]);

module.exports = { startKeyboard };
