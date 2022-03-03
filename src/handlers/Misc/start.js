'use strict';

const { Markup } = require('telegraf/extra');

module.exports = {
  data: {
    name: 'Start',
    types: ['action', 'command'],
    trigger: 'start',
  },
  method(i18n, ctx) {
    return {
      content: i18n.t('start.greeting'),
      keyboard: Markup.inlineKeyboard([Markup.callbackButton(ctx.i18n.t('start.findVideo'), 'findvideo')]),
    };
  },
};
