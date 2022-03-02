'use strict';

const fs = require('node:fs');
const path = require('node:path');

const getJSFiles = (folderPath) => {
  const categories = fs.readdirSync(folderPath);
  const result = [];
  for (const category of categories) {
    if (category.endsWith('.js')) continue;
    const files = fs.readdirSync(path.join(folderPath, category));
    const paths = files.map((fileName) => path.join(folderPath, category, fileName));
    result.push(...paths);
  }
  return result;
};

module.exports = getJSFiles;
