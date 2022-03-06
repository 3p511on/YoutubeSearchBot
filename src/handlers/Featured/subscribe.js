'use strict';

const Markup = require('telegraf/markup');
const { backButton } = require('../../keyboards/back');
const FileDatabase = require('../../services/fileDatabase');

module.exports = {
  data: {
    name: 'Subscribe',
    types: ['action', 'command'],
    trigger: 'subscribe',
  },
  method(i18n, ctx) {
    const { videoID, searchQuery } = ctx.session;
    if (!videoID || !searchQuery) {
      return {
        content: i18n.t('lastVideo.notFound'),
        keyboard: Markup.inlineKeyboard([
          [backButton(i18n, 'start', 'back.start'), backButton(i18n, 'findvideo', 'start.findVideo')],
        ]),
      };
    }
    FileDatabase.addFeatured(ctx.from.id, videoID, searchQuery);
    return {
      content: i18n.t('subscribe.success'),
      keyboard: Markup.inlineKeyboard([
        [backButton(i18n, 'featured', 'start.featured')],
        [backButton(i18n, 'start', 'back.start')],
      ]),
    };
  },
};
