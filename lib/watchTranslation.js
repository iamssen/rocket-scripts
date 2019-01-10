"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chokidar_1 = require("chokidar");
const debounce_1 = __importDefault(require("debounce"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const rxjs_1 = require("rxjs");
const exportTranslation_1 = __importDefault(require("./exportTranslation"));
module.exports = function ({ appDirectory, outputPath }) {
    return rxjs_1.Observable.create(observer => {
        const watcher = chokidar_1.watch(`${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`);
        const translations = new Map();
        const exportTranslationFiles = debounce_1.default(() => {
            exportTranslation_1.default({
                translations,
                outputPath,
            }).then(() => {
                observer.next();
            });
        }, 100);
        function update(filePath) {
            const translationJsonContent = fs_extra_1.default.readJsonSync(filePath, { encoding: 'utf8' });
            const languageCode = /\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath)[1];
            if (!translations.has(languageCode)) {
                translations.set(languageCode, new Map());
            }
            const language = translations.get(languageCode);
            if (language) {
                language.set(filePath, translationJsonContent);
            }
            exportTranslationFiles();
        }
        function unlik(filePath) {
            const languageCode = /\/([a-z]{2}-[A-Z]{2}).json$/.exec(filePath)[1];
            if (translations.has(languageCode)) {
                const language = translations.get(languageCode);
                if (language && language.has(filePath)) {
                    language.delete(filePath);
                }
                exportTranslationFiles();
            }
        }
        watcher
            .on('add', update)
            .on('change', update)
            .on('unlink', unlik);
    });
};
//# sourceMappingURL=watchTranslation.js.map