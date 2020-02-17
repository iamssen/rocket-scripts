const crypto = require('crypto');
const yaml = require('js-yaml');

const getCacheKey = (fileData, filePath, configString) => {
  return crypto.createHash('md5')
               .update(fileData)
               .update(configString)
               .digest('hex');
};

const process = (sourceText, sourcePath, config, options) => {
  const result = yaml.safeLoad(sourceText);
  const json = JSON.stringify(result, undefined, '\t');
  return `module.exports = ${json}`;
};

module.exports = {
  getCacheKey,
  process,
};