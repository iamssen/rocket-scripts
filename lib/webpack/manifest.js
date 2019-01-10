"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const webpack_manifest_plugin_1 = __importDefault(require("webpack-manifest-plugin"));
module.exports = (filename) => ({ app }) => {
    return Promise.resolve({
        plugins: [
            new webpack_manifest_plugin_1.default({
                fileName: `${app.buildPath}${filename}`,
                publicPath: app.publicPath,
            }),
        ],
    });
};
//# sourceMappingURL=manifest.js.map