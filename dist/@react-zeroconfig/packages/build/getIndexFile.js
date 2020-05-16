"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexFile = void 0;
const promised_1 = require("@ssen/promised");
async function getIndexFile({ packageDir }) {
    const indexFileSearchResult = await promised_1.glob(`${packageDir}/index.{js,jsx,ts,tsx}`);
    if (indexFileSearchResult.length === 0) {
        throw new Error(`Undefined index file on "${packageDir}"`);
    }
    else if (indexFileSearchResult.length > 1) {
        throw new Error(`Only one index file must exist : "${indexFileSearchResult.join(', ')}"`);
    }
    return indexFileSearchResult[0];
}
exports.getIndexFile = getIndexFile;
//# sourceMappingURL=getIndexFile.js.map