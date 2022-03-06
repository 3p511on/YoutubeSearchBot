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
  method(i18n, ctx) {
    const [, videoID] = ctx.match;
    const video = ctx.user.featured.find((v) => v.id === videoID);
    if (!video) {
      return {
        content: i18n.t('featured.videoNotFound'),
        keyboard: backKeyboard(i18n),
      };
    }
    const { searchQuery } = video;
    const updatedVideo = findVideo(videoID, video.searchQuery, ctx?.user?.authData?.cookies);
    if (!updatedVideo) return new Error(ctx.i18n.t('featured.noVideoOnSearch', { searchQuery }));
    return {
      content: ctx.i18n.t('findVideo.videoInfo', updatedVideo),
      keyboard: featuredKeyboard(ctx.i18n, videoID),
    };
  },
};
