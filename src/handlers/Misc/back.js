'use strict';

module.exports = {
  data: {
    name: 'SceneLeave',
    types: ['action', 'command'],
    trigger: 'back',
  },
  method(i18n, ctx) {
    ctx.scene.leave();
    return i18n.t('back.success');
  },
};
