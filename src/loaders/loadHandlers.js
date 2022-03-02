'use strict';

const path = require('node:path');
const getJSFiles = require('../utilities/getJSFiles');
const send = require('../utilities/send');

const HANDLERS_PATH = path.join(__dirname, '../handlers');

const actionHandler = async (method, ctx) => {
  try {
    const { i18n } = ctx;
    let result = await method(i18n, ctx);
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
    const files = getJSFiles(HANDLERS_PATH);
    const handlers = files.filter((file) => !file.includes('.scene'));
    for (const handlerPath of handlers) loadHandler(handlerPath, bot);
  } catch (err) {
    console.error(err);
  }
};
