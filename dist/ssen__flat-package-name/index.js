"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatPackageName = void 0;
function flatPackageName(name) {
    return /^@/.test(name) ? name.substr(1).split('/').join('__') : name;
}
exports.flatPackageName = flatPackageName;
//# sourceMappingURL=index.js.map