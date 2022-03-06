'use strict';

const { configKeyboard } = require('../../keyboards/config');
const { cookiesToString } = require('../../utilities/util');

module.exports = {
  data: {
    name: 'CurrentSettings',
    types: ['action', 'command'],
    trigger: 'settings',
  },
  method(i18n, ctx) {
    const cookies = cookiesToString(ctx?.user?.authData?.cookies);
    return { content: i18n.t('config.cookies', { cookies }), keyboard: configKeyboard(ctx.i18n) };
  },
};
