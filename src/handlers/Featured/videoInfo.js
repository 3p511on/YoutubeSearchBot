'use strict';

const { backKeyboard } = require('../../keyboards/back');
const { featuredKeyboard } = require('../../keyboards/featured');
const { findVideo } = require('../../utilities/youtube');

module.exports = {
  data: {
    name: 'VideoInfo',
    types: ['action'],
    trigger: /^featured(?::(\w+))$/i,
  },
  async method(i18n, ctx) {
    const [, videoID] = ctx.match;
    const video = ctx.user.featured.find((v) => v.info.id === videoID);
    if (!video) {
      return {
        content: ctx.i18n.t('featured.videoNotFound'),
        keyboard: backKeyboard(i18n),
      };
    }
    const { searchQuery } = video;
    const updatedVideo = await findVideo(videoID, video.searchQuery, ctx?.user?.authData?.cookies);
    if (!updatedVideo) return new Error(ctx.i18n.t('featured.noVideoOnSearch', { searchQuery }));
    const content = ctx.i18n.t('findVideo.videoInfo', updatedVideo);
    const keyboard = featuredKeyboard(ctx.i18n, videoID);
    return { content, keyboard };
  },
};
