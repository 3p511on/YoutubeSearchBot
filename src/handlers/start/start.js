'use strict';

const { send } = require('../../utilities/Telegram');

module.exports = (ctx) => {
  try {
    send(ctx, ctx.i18n.t('start.greeting'));
  } catch (err) {
    console.error(err);
  }
};
