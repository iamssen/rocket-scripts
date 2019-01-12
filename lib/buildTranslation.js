"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const exportTranslation_1 = __importDefault(require("./exportTranslation"));
module.exports = function ({ appDirectory, outputPath, type }) {
    return new Promise((resolve, reject) => {
        glob_1.default(`${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`, (error, filePaths) => {
            if (error) {
                reject(error);
                return;
            }
            const translationStore = new Map();
            for (const filePath of filePaths) {
                const content = fs_extra_1.default.readJsonSync(filePath, { encoding: 'utf8' });
                const languageCode = /\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath)[1];
                if (!translationStore.has(languageCode)) {
                    translationStore.set(languageCode, new Map());
                }
                const languageContentMap = translationStore.get(languageCode);
                if (languageContentMap) {
                    languageContentMap.set(filePath, content);
                }
            }
            exportTranslation_1.default({
                translationStore,
                outputPath,
                type,
            }).then(() => resolve());
        });
    });
};
//# sourceMappingURL=buildTranslation.js.map