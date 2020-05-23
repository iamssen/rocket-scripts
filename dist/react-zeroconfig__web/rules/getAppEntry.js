"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppEntry = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function getAppEntry({ appDir }) {
    const list = await fs_extra_1.default.readdir(appDir);
    const set = new Set(list);
    return list
        .map((html) => {
        if (path_1.default.extname(html) === '.html') {
            const name = path_1.default.basename(html, '.html');
            for (const extname of ['.ts', '.tsx', '.js', '.jsx']) {
                if (set.has(name + extname)) {
                    return { name, html, index: name + extname };
                }
            }
        }
        return null;
    })
        .filter((entry) => !!entry)
        .sort((a, b) => (a.name > b.name ? -1 : 1));
}
exports.getAppEntry = getAppEntry;
//# sourceMappingURL=getAppEntry.js.map