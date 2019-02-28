"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const toIntl_1 = require("./toIntl");
module.exports = function ({ translationStore, outputPath, type }) {
    fs_extra_1.default.mkdirpSync(path_1.default.dirname(outputPath));
    const content = {};
    for (const [languageCode, translation] of translationStore) {
        const mergedContent = deepmerge_1.default.all(Array.from(translation.values()));
        content[languageCode] = type === 'intl' ? toIntl_1.toIntl(mergedContent) : mergedContent;
    }
    return fs_extra_1.default.writeJson(outputPath, content, { spaces: 2 });
};
//# sourceMappingURL=export.js.map