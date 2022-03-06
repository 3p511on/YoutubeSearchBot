'use strict';

const { backKeyboard } = require('../../keyboards/back');
const { confirmKeyboard } = require('../../keyboards/confirm');
const FileDatabase = require('../../services/fileDatabase');
const { parseCookies, cookiesToString } = require('../../utilities/util');

const stringifyCookies = (parsedCookies) => {
  const cookiesDecorator = ([key, value]) => `<b>${key}: <code>${value}</code></b>`;
  return cookiesToString(parsedCookies, cookiesDecorator, '\n');
};

const enter = ({ i18n }) => ({
  content: i18n.t('config.cookiesEnter'),
  keyboard: backKeyboard(i18n, 'settings', 'back.settings'),
});

const decline = ({ i18n }) => ({
  content: i18n.t('config.decline'),
  keyboard: backKeyboard(i18n, 'settings', 'back.settings'),
  end: true,
});

const getCookies = (ctx) => {
  if (!ctx?.message?.text) return null;
  const parsedCookies = parseCookies(ctx.message.text);
  if (!parsedCookies) return new Error('config.invalidCookies');
  ctx.session.cookies = parsedCookies;
  return {
    content: ctx.i18n.t('config.confirm', { cookies: stringifyCookies(parsedCookies) }),
    keyboard: confirmKeyboard(ctx.i18n),
  };
};

const confirmCookies = (ctx) => {
  const cbQueryData = ctx?.update?.callback_query?.data;
  if (!cbQueryData) return null;
  if (cbQueryData !== 'confirm') return decline(ctx);
  FileDatabase.updateUser(ctx.from.id, { authData: { cookies: ctx.session.cookies } });
  return {
    content: ctx.i18n.t('config.success'),
    keyboard: backKeyboard(ctx.i18n, 'settings', 'back.settings'),
    end: true,
  };
};

module.exports = {
  data: {
    name: 'ChangeCookies',
    type: 'wizard',
  },
  methods: [enter, getCookies, confirmCookies],
};
