'use strict';

const { backKeyboard } = require('../../keyboards/back');
const { videoInfoKeyboard } = require('../../keyboards/videoInfo');
const { extractID, findVideo } = require('../../utilities/youtube');

module.exports = {
  data: {
    name: 'FindVideo',
    type: 'wizard',
  },
  methods: [
    (ctx) => ({
      content: ctx.i18n.t('findVideo.provideLink'),
      keyboard: backKeyboard(ctx.i18n),
    }),
    (ctx) => {
      if (!ctx?.message?.text) return null;
      const id = extractID(ctx.message.text);
      if (!id) return new Error('findVideo.invalidLink');
      ctx.session.videoID = id;
      return {
        content: ctx.i18n.t('findVideo.provideQuery'),
        keyboard: backKeyboard(ctx.i18n),
      };
    },
    async (ctx) => {
      if (!ctx?.message?.text) return null;
      ctx.session.searchQuery = ctx.message.text;
      const { videoID, searchQuery } = ctx.session;
      const video = await findVideo(videoID, searchQuery, ctx?.user?.authData?.cookies);
      if (!video) return new Error(ctx.i18n.t('findVideo.videoNotFound', { searchQuery }));
      ctx.session.video = video;
      return {
        content: ctx.i18n.t('findVideo.videoInfo', video),
        keyboard: videoInfoKeyboard(ctx.i18n),
        end: true,
      };
    },
  ],
};
