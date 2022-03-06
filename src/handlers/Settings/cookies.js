'use strict';

module.exports = {
  data: {
    name: 'CookiesEnter',
    types: ['action', 'command'],
    trigger: 'cookies',
  },
  method(i18n, ctx) {
    ctx.scene.enter('ChangeCookies');
    return null;
  },
};
