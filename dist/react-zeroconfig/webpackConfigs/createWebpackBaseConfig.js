"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebpackBaseConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createWebpackBaseConfig({ zeroconfigPath }) {
    const modules = ['node_modules'];
    const zeroconfigModules = path_1.default.join(zeroconfigPath, 'node_modules');
    if (fs_1.default.existsSync(zeroconfigModules) && fs_1.default.statSync(zeroconfigModules).isDirectory()) {
        modules.push(zeroconfigModules);
    }
    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
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
exports.createWebpackBaseConfig = createWebpackBaseConfig;
//# sourceMappingURL=createWebpackBaseConfig.js.map