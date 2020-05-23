"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixChunkPath = void 0;
function fixChunkPath(chunkPath) {
    return chunkPath.length > 0 && !/\/$/.test(chunkPath) ? chunkPath + '/' : chunkPath;
}
exports.fixChunkPath = fixChunkPath;
//# sourceMappingURL=fixChunkPath.js.map