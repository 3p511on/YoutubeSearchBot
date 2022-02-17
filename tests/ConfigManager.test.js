'use strict';

const ConfigManager = require('../src/utilities/ConfigManager');

// TODO: Test creating clear config when it does not exists

// TODO: Test getConfig()
// - creation of clear config when it does not exists
// - return parsed file content

// TODO: Test updateConfig()
// - should save provided stringified config

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
