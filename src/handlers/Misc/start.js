'use strict';

const { startKeyboard } = require('../../keyboards/start');

module.exports = {
  data: {
    name: 'Start',
    types: ['action', 'command'],
    trigger: 'start',
  },
  method(i18n) {
    return {
      content: i18n.t('start.greeting'),
      keyboard: startKeyboard(i18n),
    };
  },
};
