'use strict';

const FileDatabase = require('../services/fileDatabase');
const { findVideo } = require('../utilities/youtube');

const LANGUAGE_CODE = 'ru';

module.exports = async (bot, i18n) => {
  const users = FileDatabase.getConfig();
  for await (const user of users) {
    if (!user?.featured) continue;
    for (const featuredVideo of user.featured) {
      const { searchQuery, info } = featuredVideo;
      try {
        const video = await findVideo(info?.id, searchQuery, user.authData?.cookies);
        if (!video) throw new Error('Video not found');
      } catch (err) {
        if (err.message !== 'Video not found') console.error(err);
        FileDatabase.removeFeatured(user.userID, info?.id);
        const message = i18n.t(LANGUAGE_CODE, 'videoCheck.videoNotFound', featuredVideo);
        bot.telegram.sendMessage(user.userID, message);
      }
    }
  }
};
