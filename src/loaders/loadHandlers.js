'use strict';

const fs = require('node:fs');
const path = require('node:path');
const send = require('../utilities/send');

const HANDLERS_PATH = path.join(__dirname, '../handlers');

const actionHandler = async (method, ctx) => {
  try {
    const { i18n } = ctx;
    let result = await method(ctx, i18n);
    if (typeof result === 'string') result = { content: result };
    if (result) await send(ctx, result);
  } catch (err) {
    console.error(err);
  }
};

const loadHandler = (filePath, bot) => {
  try {
    const { data, method } = require(filePath);
    if (!data || !method) throw new Error('file exports anything');
    for (const type of data.types) {
      bot[type](data.trigger, actionHandler.bind(null, method));
    }
    console.log(`[Loader] ${data?.name} was successfully loaded`);
    return true;
  } catch (err) {
    console.error(`[Loader ERR] Failed to load ${filePath}: ${err.message}`);
    return err;
  }
};

module.exports = (bot) => {
  try {
    const categories = fs.readdirSync(HANDLERS_PATH);
    for (const category of categories) {
      if (category.endsWith('.js')) continue;
      const files = fs.readdirSync(path.join(HANDLERS_PATH, category));
      const handlers = files
        .filter((file) => !file.includes('.scene'))
        .map((fileName) => path.join(HANDLERS_PATH, category, fileName));
      for (const handlerPath of handlers) loadHandler(handlerPath, bot);
    }
  } catch (err) {
    console.error(err);
  }
};
