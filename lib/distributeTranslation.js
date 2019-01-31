"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const getCurrentTime_1 = __importDefault(require("./getCurrentTime"));
const intlFormatToTranslation_1 = require("./intlFormatToTranslation");
module.exports = function ({ filePath, appDirectory, type }) {
    return new Promise((resolve, reject) => {
        const localesJsonContent = fs_extra_1.default.readJsonSync(filePath, { encoding: 'utf8' });
        const localesContent = type === 'intl'
            ? intlFormatToTranslation_1.intlFormatToTranslation(localesJsonContent)
            : localesJsonContent;
        glob_1.default(`${appDirectory}/src/**/locales/[a-z][a-z]-[A-Z][A-Z].json`, (error, jsonFiles) => {
            if (error) {
                reject(error);
                return;
            }
            for (const jsonFile of jsonFiles) {
                const languageCode = path_1.default.basename(jsonFile, '.json');
                const jsonContent = fs_extra_1.default.readJsonSync(jsonFile, { encoding: 'utf8' });
                const updated = new Map();
                function search(content, parentKeys = []) {
                    Object.keys(content).forEach((key) => {
                        const keys = [...parentKeys, key];
                        if (typeof content[key] === 'string') {
                            const value = keys.reduce((data, k) => data[k], localesContent[languageCode]);
                            if (value !== content[key]) {
                                updated.set(keys.join('.'), [content[key], value]);
                                content[key] = value;
                            }
                        }
                        else if (Object.keys(content[key]).length > 0) {
                            search(content[key], keys);
                        }
                    });
                }
                search(jsonContent);
                if (updated.size > 0) {
                    console.log(`[${getCurrentTime_1.default()}] 📝 "${jsonFile}" updated.`);
                    for (const [keys, [prev, next]] of updated) {
                        console.log(`   ${chalk_1.default.underline.bold(keys)} ${chalk_1.default.gray(prev)} → ${next}`);
                    }
                    fs_extra_1.default.writeJsonSync(jsonFile, jsonContent, { encoding: 'utf8', spaces: 2 });
                }
            }
        });
    });
};
//# sourceMappingURL=distributeTranslation.js.map