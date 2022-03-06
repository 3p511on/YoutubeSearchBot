'use strict';

const Markup = require('telegraf/markup');
const { backKeyboard } = require('../../keyboards/back');
const { Video } = require('../../utilities/youtube');

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
    const videoButtons = ctx.user.featured.map((v) => [Markup.callbackButton(v.title, `featured:${v.id}`)]);
    return { content: i18n.t('featured.videos'), keyboard: Markup.inlineKeyboard(videoButtons) };
  },
};
