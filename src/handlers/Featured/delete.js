'use strict';

const Markup = require('telegraf/markup');
const { backButton, backKeyboard } = require('../../keyboards/back');
const FileDatabase = require('../../services/fileDatabase');

module.exports = {
  data: {
    name: 'Unsubscribe',
    types: ['action'],
    trigger: /^unsubscribe(?::(\w+))$/i,
  },
  method(i18n, ctx) {
    const [, videoID] = ctx.match;
    const video = ctx.user.featured.find((v) => v.info.id === videoID);
    if (!video) {
      return {
        content: i18n.t('featured.videoNotFound'),
        keyboard: backKeyboard(i18n),
      };
    }
    FileDatabase.removeFeatured(ctx.from.id, videoID);
    return {
      content: i18n.t('featured.removeSuccess'),
      keyboard: Markup.inlineKeyboard([
        [backButton(i18n, 'start', 'back.start'), backButton(i18n, 'featured', 'start.featured')],
      ]),
    };
  },
};
