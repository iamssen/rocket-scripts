"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const exportTranslation_1 = __importDefault(require("./exportTranslation"));
module.exports = function ({ appDirectory, outputPath }) {
    return new Promise((resolve, reject) => {
        glob_1.default(`${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`, (error, filePaths) => {
            if (error) {
                reject(error);
                return;
            }
            const translations = new Map();
            for (const filePath of filePaths) {
                const translationJsonContent = fs_extra_1.default.readJsonSync(filePath, { encoding: 'utf8' });
                const languageCode = /\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath)[1];
                if (!translations.has(languageCode)) {
                    translations.set(languageCode, new Map());
                }
                const language = translations.get(languageCode);
                if (language) {
                    language.set(filePath, translationJsonContent);
                }
            }
            exportTranslation_1.default({
                translations,
                outputPath,
            }).then(() => resolve());
        });
    });
};
//# sourceMappingURL=buildTranslation.js.map