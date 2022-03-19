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
    const { video, searchQuery } = ctx.session;
    if (!video?.info?.id || !video?.searchQuery) {
      return {
        content: i18n.t('lastVideo.notFound'),
        keyboard: Markup.inlineKeyboard([
          [backButton(i18n, 'start', 'back.start'), backButton(i18n, 'findvideo', 'start.findVideo')],
        ]),
      };
    }
    FileDatabase.addFeatured(ctx.from.id, video, searchQuery);
    return {
      content: i18n.t('featured.addSuccess'),
      keyboard: Markup.inlineKeyboard([
        [backButton(i18n, 'start', 'back.start'), backButton(i18n, 'featured', 'start.featured')],
      ]),
    };
  },
};
