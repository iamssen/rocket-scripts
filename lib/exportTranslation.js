"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
module.exports = function ({ translations, outputPath }) {
    fs_extra_1.default.mkdirpSync(path_1.default.dirname(outputPath));
    const json = {};
    for (const [languageCode, translation] of translations) {
        json[languageCode] = deepmerge_1.default.all(Array.from(translation.values()));
    }
    return fs_extra_1.default.writeJson(outputPath, json, { spaces: 2 });
};
//# sourceMappingURL=exportTranslation.js.map