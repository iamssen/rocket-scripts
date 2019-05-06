"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createBaseWebpackConfig({ zeroconfigPath }) {
    const modules = ['node_modules'];
    if (fs_1.default.existsSync(path_1.default.join(zeroconfigPath, 'node_modules'))) {
        modules.push(path_1.default.join(zeroconfigPath, 'node_modules'));
    }
    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        resolveLoader: {
            modules,
        },
        performance: {
            hints: 'warning',
            maxEntrypointSize: 30000000,
            maxAssetSize: 20000000,
        },
        stats: {
            modules: false,
            maxModules: 0,
            errors: true,
            warnings: true,
            children: false,
            moduleTrace: true,
            errorDetails: true,
        },
    };
}
exports.createBaseWebpackConfig = createBaseWebpackConfig;
//# sourceMappingURL=createBaseWebpackConfig.js.map