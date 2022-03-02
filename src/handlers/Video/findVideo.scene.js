'use strict';

const { extractID } = require('../../utilities/youtube');

module.exports = {
  data: {
    name: 'FindVideo',
    type: 'wizard',
  },
  methods: [
    (ctx) =>
      // TODO: Leave button
      ctx.i18n.t('findVideo.provideLink'),
    (ctx) => {
      const id = extractID(ctx.message.text);
      if (!id) return new Error('findVideo.invalidLink');
      console.log(id);
      ctx.session.videoID = id;
      return { end: true };
    },
  ],
};
