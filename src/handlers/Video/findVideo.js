'use strict';

module.exports = {
  data: {
    name: 'FindVideoEnter',
    types: ['action', 'command'],
    trigger: 'findvideo',
  },
  method(i18n, ctx) {
    ctx.scene.enter('FindVideo');
    return null;
  },
};
