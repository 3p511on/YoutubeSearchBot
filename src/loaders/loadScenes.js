'use strict';

const path = require('node:path');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const Stage = require('telegraf/stage');
const getJSFiles = require('../utilities/getJSFiles');
const send = require('../utilities/send');

const HANDLERS_PATH = path.join(__dirname, '../handlers');

const loadStep = async (step, ctx) => {
  try {
    const result = await step(ctx);
    if (result?.end) ctx.scene.leave();
    else if (result instanceof Error) return send(ctx, ctx.i18n.t(result.message));
    if (result) send(ctx, result);
    if (ctx.wizard) ctx.wizard.next();
    return true;
  } catch (err) {
    console.error(err);
    return send(ctx, ctx.i18n.t('error.internal'));
  }
};

const loadScene = (scenePath) => {
  try {
    const { data, method, methods } = require(scenePath);
    const isWizard = data.type === 'wizard';
    if (isWizard) {
      const steps = methods.map((m) => (ctx) => loadStep(m, ctx));
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
    const scenes = scenePaths.map((scenePath) => loadScene(scenePath));
    const stage = new Stage(scenes);
    bot.use(stage.middleware());
  } catch (err) {
    console.error(err);
  }
};
