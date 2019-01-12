"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const createConfig_1 = __importDefault(require("./createConfig"));
const getAlias_1 = __importDefault(require("./getAlias"));
const config = createConfig_1.default({
    command: 'editor.webpack',
    appDirectory: process.cwd(),
    zeroconfigDirectory: path_1.default.join(__dirname, '..'),
});
module.exports = function () {
    return {
        resolve: {
            alias: getAlias_1.default(config),
        },
    };
};
//# sourceMappingURL=createWebstormWebpackConfig.js.map