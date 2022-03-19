'use strict';

const Markup = require('telegraf/markup');
const { backKeyboard } = require('../../keyboards/back');

module.exports = {
  data: {
    name: 'GetFeatured',
    types: ['action', 'command'],
    trigger: 'featured',
  },
  method(i18n, ctx) {
    const videos = ctx.user?.featured;
    if (!videos?.length) {
      return {
        content: i18n.t('featured.noVideos'),
        keyboard: backKeyboard(i18n),
      };
    }
    const videoButtons = videos.map((v) => [Markup.callbackButton(v.info.title, `featured:${v.info.id}`)]);
    return { content: i18n.t('featured.videos'), keyboard: Markup.inlineKeyboard(videoButtons) };
  },
};
