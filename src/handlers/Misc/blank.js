'use strict';

module.exports = {
  data: {
    name: 'Blank',
    types: ['action'],
    trigger: 'blank',
  },
  method(i18n, ctx) {
    ctx.answerCbQuery(ctx.i18n.t('blank'));
    return null;
  },
};
