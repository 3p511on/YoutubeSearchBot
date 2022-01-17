'use strict';

const Extra = require('telegraf/extra');

module.exports = class Telegram extends null {
  /**
   * Function for determining the type of event.
   * If clicking on the inline button - change the message, if the command - send a response in a new one
   * @param {TelegrafContext} ctx Event's context
   * @param {string} content Message content
   * @param {Object} keyboard Keyboards
   */
  static async send(ctx, content, keyboard) {
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
  }
};
