'use strict';

const fs = require('fs');
const ConfigManager = require('../src/utilities/ConfigManager');

const CONFIG_PATH = 'config.json';
const TEMP_CONFIG_PATH = `${CONFIG_PATH}.bak`;

const exists = (filePath = CONFIG_PATH) => fs.existsSync(filePath);
const configExists = () => exists(CONFIG_PATH);
const deleteConfig = () => {
  if (configExists()) fs.unlinkSync(CONFIG_PATH);
};

// Save current config, if it already exists
beforeAll(() => {
  if (!configExists()) return;
  fs.renameSync(CONFIG_PATH, TEMP_CONFIG_PATH);
});

afterAll(() => {
  deleteConfig();
  if (exists(TEMP_CONFIG_PATH)) fs.renameSync(TEMP_CONFIG_PATH, CONFIG_PATH);
});

describe('getConfig()', () => {
  beforeEach(deleteConfig);

  it('should return empty array, when config does not exist', () => {
    const config = ConfigManager.getConfig();
    expect(Array.isArray(config)).toBeTruthy();
    expect(config.length).toBe(0);
  });

  it('should create config file, if it does not exists', () => {
    ConfigManager.getConfig();
    expect(configExists()).toBeTruthy();
    const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
    expect(rawConfig).toBe('[]');
  });

  it('should return parsed file content', () => {
    const configContent = [{ userID: 123, authData: 'Hi Mom!' }];
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(configContent));

    const returnedValue = ConfigManager.getConfig();
    expect(returnedValue).toEqual(configContent);
  });
});

describe('updateConfig()', () => {
  it('should save given data to config file properly', () => {
    const newConfig = [{ userID: 123, authData: 'Hi Mom!' }];
    ConfigManager.updateConfig(newConfig);

    const rawConfig = fs.readFileSync(CONFIG_PATH);
    const parsedConfig = JSON.parse(rawConfig);
    expect(parsedConfig).toEqual(newConfig);
  });
});

// TODO: Test createUser
// - should save defaultConfig, if nothing was provided
// - should use provided config
// - new data should be stored in config file

// TODO: getUser
// - should return blank user object, if entry doesn't exists
// - should return user from config from provided id
// - should use custom config if it was provided

// TODO: updateUser
// - should add new properties to user
// - should save new data to config file
// - should use custom config if it was provided
