"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icuFormat = exports.parseNumber = void 0;
const intl_messageformat_1 = require("intl-messageformat");
function parseNumber(source) {
    const n = Number(source);
    return isNaN(n) ? n : undefined;
}
exports.parseNumber = parseNumber;
function icuFormat(text, vars) {
    const { format } = new intl_messageformat_1.IntlMessageFormat(text);
    const result = format(vars);
    return Array.isArray(result) ? result.join(' ') : result.toString();
}
exports.icuFormat = icuFormat;
//# sourceMappingURL=index.js.map