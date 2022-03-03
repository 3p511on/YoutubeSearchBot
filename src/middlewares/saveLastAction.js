/* eslint-disable callback-return */
'use strict';

module.exports = (ctx, next) => {
  try {
    next();
    const isCommand = ctx.updateType === 'message' && ctx?.message?.text?.startsWith('/');
    const actionId = isCommand ? ctx.message?.text.slice(1) : ctx?.callback_query?.data;
    ctx.session.lastAction = actionId ?? null;
  } catch (err) {
    console.error(err);
  }
};
