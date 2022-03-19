'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CONFIG_PATH = path.join(__dirname, '../../config.json');
const defaultConfig = { userID: 0, authData: null };

module.exports = class FileDatabase {
  static getConfig() {
    const isConfigExists = fs.existsSync(CONFIG_PATH);
    if (!isConfigExists) {
      fs.writeFileSync(CONFIG_PATH, '[]');
      return [];
    }

    const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const parsedConfig = JSON.parse(rawConfig);
    return parsedConfig;
  }

  static updateConfig(newConfig) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
  }

  static createUser(userData = {}, config = this.getConfig()) {
    // TODO: Probably should add validation, whether the user is already created
    const data = { ...defaultConfig, ...userData };
    config.push(data);
    this.updateConfig(config);
    return data;
  }

  static getUser(userID, config = this.getConfig()) {
    const user = config.find((entry) => entry.userID === userID);
    if (!user) return this.createUser({ userID });
    return user;
  }

  static updateUser(userID, newData = {}, config = this.getConfig()) {
    const updatedUser = { ...this.getUser(userID, config), ...newData };
    const oldUserIndex = config.findIndex((entry) => entry.userID === updatedUser.userID);
    config[oldUserIndex] = updatedUser;
    this.updateConfig(config);
  }

  static addFeatured(userID, video, searchQuery, config = this.getConfig()) {
    const user = this.getUser(userID, config);
    if (!user.featured) user.featured = [];
    const isVideoAlreadyFeatured = user.featured.find((v) => v.info.id === video.info.id);
    if (isVideoAlreadyFeatured) return;
    user.featured.push({ ...video, searchQuery });
    this.updateUser(userID, user, config);
  }

  static removeFeatured(userID, videoID, config = this.getConfig()) {
    const user = this.getUser(userID, config);
    if (!user.featured) user.featured = [];
    user.featured = user.featured.filter((v) => v.info.id !== videoID);
    this.updateUser(userID, user, config);
  }
};
