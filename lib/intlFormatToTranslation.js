"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function intlFormatToTranslation(content) {
    const result = {};
    Object.keys(content).forEach(languageCode => {
        Object.keys(content[languageCode]).forEach(id => {
            const value = content[languageCode][id];
            const keys = id.split('.');
            const branchKeys = keys.slice(0, keys.length - 1);
            const leafKey = keys[keys.length - 1];
            if (!result[languageCode]) {
                result[languageCode] = {};
            }
            let branch = result[languageCode];
            for (const branchKey of branchKeys) {
                if (!branch[branchKey]) {
                    branch[branchKey] = {};
                }
                branch = branch[branchKey];
            }
            branch[leafKey] = value;
        });
    });
    return result;
}
exports.intlFormatToTranslation = intlFormatToTranslation;
//# sourceMappingURL=intlFormatToTranslation.js.map