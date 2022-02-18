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
const getConfigContent = () => {
  const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
  const parsedConfig = JSON.parse(rawConfig);
  return parsedConfig;
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
    expect(getConfigContent()).toEqual(newConfig);
  });
});

describe('createUser()', () => {
  beforeEach(deleteConfig);

  const check = (input, expectedOutput) => {
    const returnedValue = ConfigManager.createUser(...input);
    expect(returnedValue).toEqual(expectedOutput);
    expect(getConfigContent()).toEqual([expectedOutput]);
  };

  it('should save defaultConfig, if nothing was provided', () => {
    check([{}], { userID: 0, authData: null });
  });

  it('should save options that was not provided in defaultConfig', () => {
    check([{ userID: 123, test: true }], { userID: 123, authData: null, test: true });
  });

  it('should use default options if only userID was provided', () => {
    check([{ userID: 123 }], { userID: 123, authData: null });
  });

  it('should use given config object if it is provided', () => {
    const customConfig = [{ userID: 456, authData: 'test' }];
    const expectedOutput = [...customConfig, { userID: 123, authData: null }];
    ConfigManager.createUser({ userID: 123 }, customConfig);
    expect(getConfigContent()).toEqual(expectedOutput);
  });
});

describe('getUser()', () => {
  beforeEach(deleteConfig);

  it('should create and return new user if he does not exist', () => {
    const returnedValue = ConfigManager.getUser(123);
    const expectedOutput = { userID: 123, authData: null };
    expect(returnedValue).toEqual(expectedOutput);
  });

  it('should save new user to config file if he does not exist', () => {
    ConfigManager.getUser(123);
    const config = getConfigContent();
    const user = config.find((entry) => entry.userID === 123);
    expect(user).toEqual({ userID: 123, authData: null });
  });

  it('should return user from config file within provided id', () => {
    const userObject = { userID: 123, authData: 'Hi Mom!', test: true };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify([userObject]));
    const returnedValue = ConfigManager.getUser(123);
    expect(returnedValue).toEqual(userObject);
  });

  it('should use custom config if it was provided', () => {
    const userObject = { userID: 123, authData: 'Hi Mom!', test: true };
    const returnedValue = ConfigManager.getUser(123, [userObject]);
    expect(returnedValue).toEqual(userObject);
  });
});

describe('updateUser()', () => {
  beforeEach(deleteConfig);

  it('should add new properties to already created user', () => {
    ConfigManager.getUser(123);
    ConfigManager.updateUser(123, { test: true });
    const config = getConfigContent();
    const user = config.find((entry) => entry.userID === 123);
    expect(user).toEqual({ userID: 123, authData: null, test: true });
  });

  it('should update old properties of already created user', () => {
    ConfigManager.getUser(123);
    ConfigManager.updateUser(123, { authData: 'Test' });
    const config = getConfigContent();
    const user = config.find((entry) => entry.userID === 123);
    expect(user).toEqual({ userID: 123, authData: 'Test' });
  });

  it('should use custom config if it was provided', () => {
    const customConfig = [
      { userID: 123, authData: 'Test', test: true },
      { userID: 456, authData: null },
    ];

    ConfigManager.updateUser(123, { test: false }, customConfig);
    ConfigManager.updateUser(456, { test: true }, customConfig);

    const config = getConfigContent();
    const [userA, userB] = config;
    expect(userA).toEqual({ userID: 123, authData: 'Test', test: false });
    expect(userB).toEqual({ userID: 456, authData: null, test: true });
  });
});
