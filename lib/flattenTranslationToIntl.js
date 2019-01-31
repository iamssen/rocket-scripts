"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flattenTranslationToIntl(translationContent) {
    const result = {};
    function search(content, parentKeys = []) {
        Object.keys(content).forEach((key) => {
            const keys = [...parentKeys, key];
            const value = content[key];
            if (typeof value === 'string') {
                result[keys.join('.')] = value;
            }
            else {
                search(value, keys);
            }
        });
    }
    search(translationContent);
    return result;
}
exports.flattenTranslationToIntl = flattenTranslationToIntl;
//# sourceMappingURL=flattenTranslationToIntl.js.map