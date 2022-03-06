'use strict';

const path = require('node:path');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const Stage = require('telegraf/stage');
const { backKeyboard } = require('../keyboards/back');
const { sceneRepeatKeyboard } = require('../keyboards/back');
const getJSFiles = require('../utilities/getJSFiles');
const send = require('../utilities/send');

const HANDLERS_PATH = path.join(__dirname, '../handlers');

const handleBack = (ctx, bot) => {
  const callbackQuery = ctx.update.callback_query;
  if (!['start', 'settings'].includes(callbackQuery?.data)) return null;
  ctx.scene.leave();
  bot.handleUpdate(ctx.update);
  return true;
};

// TODO: Refactor this
const loadStep = async (step, ctx, bot, sceneName) => {
  try {
    ctx.session.lastScene = sceneName;
    handleBack(ctx, bot);
    const result = await step(ctx);
    if (result?.end) ctx.scene.leave();
    if (result instanceof Error) {
      ctx.scene.leave();
      send(ctx, { content: result.message, keyboard: sceneRepeatKeyboard(ctx.i18n) });
    }
    if (result) send(ctx, result);
    if (ctx.wizard) ctx.wizard.next();
    return true;
  } catch (err) {
    console.error(err);
    ctx.scene.leave();
    return send(ctx, { content: ctx.i18n.t('error.internal'), keyboard: backKeyboard(ctx.i18n) });
  }
};

const loadScene = (scenePath, bot) => {
  try {
    const { data, method, methods } = require(scenePath);
    const isWizard = data.type === 'wizard';
    if (isWizard) {
      const steps = methods.map((m) => (ctx) => loadStep(m, ctx, bot, data.name));
      return new WizardScene(data.name, ...steps);
    }
    const scene = new Scene(data.name);
    method(scene);
    return scene;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = (bot) => {
  try {
    const files = getJSFiles(HANDLERS_PATH);
    const scenePaths = files.filter((file) => file.includes('.scene'));
    const scenes = scenePaths.map((scenePath) => loadScene(scenePath, bot));
    const stage = new Stage(scenes);
    bot.use(stage.middleware());
  } catch (err) {
    console.error(err);
  }
};
