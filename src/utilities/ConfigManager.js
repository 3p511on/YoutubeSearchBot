'use strict';

const fs = require('node:fs');

const CONFIG_PATH = 'config.json';
const defaultConfig = { userID: 0, authData: null };

module.exports = class ConfigManager {
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
};
