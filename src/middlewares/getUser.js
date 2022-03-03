'use strict';

const FileDatabase = require('../services/fileDatabase');

module.exports = (ctx, next) => {
  try {
    ctx.user = FileDatabase.getUser(ctx.from.id);
  } catch (err) {
    console.error(err);
  }
  return next();
};
