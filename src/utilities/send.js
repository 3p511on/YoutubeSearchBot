'use strict';

const Extra = require('telegraf/extra');

const send = async (ctx, data = {}) => {
  let { content, keyboard } = data;
  if (typeof data === 'string') content = data;
  if (!content) return null;
  const markup = keyboard ? keyboard.extra(Extra.HTML()) : { parse_mode: 'HTML' };
  try {
    const hasPhoto = ctx.update?.callback_query?.message?.photo;
    if (ctx.message || hasPhoto) {
      if (hasPhoto) await ctx.editMessageReplyMarkup();
      const msg = await ctx.replyWithHTML(content, markup);
      return msg;
    } else {
      await ctx.answerCbQuery();
      await ctx.editMessageText(content, markup);
    }
  } catch (err) {
    if (err.message.includes('message is not modified')) return false;
    console.error(err);
  }
  return true;
};

module.exports = send;
