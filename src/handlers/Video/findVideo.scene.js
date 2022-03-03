'use strict';

const { backKeyboard } = require('../../keyboards/back');
const { videoInfoKeyboard } = require('../../keyboards/videoInfo');
const { extractID, getSearchResults } = require('../../utilities/youtube');

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
      const userCookies = ctx?.user?.authData?.cookies;
      const searchResults = await getSearchResults(searchQuery, userCookies);
      const videoInfo = searchResults.find((r) => r.id === videoID);
      if (!videoInfo) return new Error('findVideo.videoNotFound', { searchQuery });
      const position = searchResults.findIndex((video) => video.id === videoID) + 1;
      const templateVariables = { videoInfo, searchQuery, position };
      return {
        content: ctx.i18n.t('findVideo.videoInfo', templateVariables),
        keyboard: videoInfoKeyboard(ctx.i18n),
        end: true,
      };
    },
  ],
};
