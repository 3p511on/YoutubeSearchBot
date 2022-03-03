'use strict';

require('dotenv').config();

const path = require('path');
const { Telegraf } = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const session = require('telegraf/session');

const getUser = require('./middlewares/getUser');
const bot = new Telegraf(process.env.BOT_TOKEN);

const i18n = new TelegrafI18n({
  defaultLanguage: 'ru',
  directory: path.resolve(__dirname, 'locales'),
});
bot.use(i18n.middleware());
bot.use(session());
bot.use(getUser);

require('./loaders/loadScenes')(bot);
require('./loaders/loadHandlers')(bot);

bot.launch();
