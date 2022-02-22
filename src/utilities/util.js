'use strict';

const parseJSON = (string) => {
  try {
    return [null, JSON.parse(string)];
  } catch (err) {
    return [err, null];
  }
};

module.exports = { parseJSON };
