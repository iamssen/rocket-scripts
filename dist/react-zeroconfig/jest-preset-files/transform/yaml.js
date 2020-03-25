"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const crypto_1 = __importDefault(require("crypto"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function getCacheKey(fileData, filePath, configString) {
    return crypto_1.default.createHash('md5').update(fileData).update(configString).digest('hex');
}
function process(sourceText) {
    const result = js_yaml_1.default.safeLoad(sourceText);
    const json = JSON.stringify(result, undefined, '\t');
    return `module.exports = ${json}`;
}
module.exports = {
    getCacheKey,
    process,
};
//# sourceMappingURL=yaml.js.map