"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const createConfig_1 = __importDefault(require("./utils/createConfig"));
const getAlias_1 = __importDefault(require("./utils/webpack/getAlias"));
module.exports = function (appDirectory = process.cwd()) {
    const config = createConfig_1.default({
        command: 'editor.webpack',
        appDirectory,
        zeroconfigDirectory: path_1.default.join(__dirname, '..'),
    });
    return {
        resolve: {
            alias: getAlias_1.default(config),
        },
    };
};
//# sourceMappingURL=createWebstormWebpackConfig.js.map