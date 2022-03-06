'use strict';

const { backKeyboard } = require('../../keyboards/back');

module.exports = {
  data: {
    name: 'RepeatScene',
    types: ['action', 'command'],
    trigger: 'repeat',
  },
  method(i18n, ctx) {
    if (!ctx.session?.lastScene) {
      return {
        content: i18n.t('repeat.noLastScene'),
        keyboard: backKeyboard(i18n),
      };
    }
    ctx.scene.enter(ctx.session.lastScene);
    return null;
  },
};
