'use strict';

const { Markup } = require('telegraf/extra');
const { backButton } = require('../../keyboards/back');
const { videoInfoKeyboard } = require('../../keyboards/videoInfo');
const { findVideo } = require('../../utilities/youtube');

module.exports = {
  data: {
    name: 'LastVideoInfo',
    types: ['action', 'command'],
    trigger: 'last',
  },
  async method(i18n, ctx) {
    const { videoID, searchQuery } = ctx.session;
    if (!videoID || !searchQuery) {
      return {
        content: i18n.t('lastVideo.notFound'),
        keyboard: Markup.inlineKeyboard([
          [backButton(i18n, 'start', 'back.start'), backButton(i18n, 'findvideo', 'start.findVideo')],
        ]),
      };
    }
    const video = await findVideo(videoID, searchQuery, ctx?.user?.authData?.cookies);
    if (!video) return new Error(ctx.i18n.t('findVideo.videoNotFound', { searchQuery }));
    return {
      content: ctx.i18n.t('findVideo.videoInfo', video),
      keyboard: videoInfoKeyboard(ctx.i18n),
    };
  },
};
