'use strict';

const { Markup } = require('telegraf/extra');

module.exports = {
  data: {
    name: 'Start',
    types: ['action', 'command'],
    trigger: 'start',
  },
  method(i18n, ctx) {
    ctx.scene.enter('FindVideo');
    return {
      content: i18n.t('start.greeting'),
      keyboard: Markup.inlineKeyboard([Markup.callbackButton('test', 'start')]),
    };
  },
};
