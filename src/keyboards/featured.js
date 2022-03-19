'use strict';

const Markup = require('telegraf/markup');
const { backButton } = require('./back');

const featuredKeyboard = (i18n, id) =>
  Markup.inlineKeyboard([
    [Markup.callbackButton(i18n.t('featured.unsubscribe'), `unsubscribe:${id}`)],
    [Markup.callbackButton(i18n.t('featured.update'), `featured:${id}`)],
    [backButton(i18n)],
  ]);

module.exports = { featuredKeyboard };
