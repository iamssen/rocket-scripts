"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getDefaultEntry_1 = require("./getDefaultEntry");
const getDefaultModulePublics_1 = require("./getDefaultModulePublics");
const getDefaultModulesEntry_1 = require("./getDefaultModulesEntry");
const glob_1 = __importDefault(require("glob"));
module.exports = function ({ command, appDirectory, zeroconfigDirectory }) {
    // tslint:disable:no-any
    const packageJson = require(path_1.default.join(appDirectory, 'package.json'));
    // tslint:enable:no-any
    const userConfig = fs_1.default.existsSync(path_1.default.join(process.cwd(), 'zeroconfig.local.config.js'))
        ? require(path_1.default.join(appDirectory, 'zeroconfig.local.config.js'))
        : fs_1.default.existsSync(path_1.default.join(process.cwd(), 'zeroconfig.config.js'))
            ? require(path_1.default.join(appDirectory, 'zeroconfig.config.js'))
            : packageJson.zeroconfig || {};
    const app = {
        entry: getDefaultEntry_1.getDefaultEntry(appDirectory),
        port: 3100,
        staticFileDirectories: ['public'].concat(getDefaultModulePublics_1.getDefaultModulePublics(appDirectory)),
        buildPath: '',
        https: false,
        vendorFileName: 'vendor',
        styleFileName: 'style',
        publicPath: '',
        ssrPort: 4100,
        ...(userConfig.app || {}),
    };
    if (app.buildPath !== '' && !/\/$/.test(app.buildPath)) {
        app.buildPath = app.buildPath + '/';
    }
    const modules = {
        entry: getDefaultModulesEntry_1.getDefaultModulesEntry(appDirectory),
        ...(userConfig.modules || {}),
    };
    const ssrEnabled = fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_ssr')) && fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_ssr')).isDirectory();
    const typescriptEnabled = glob_1.default.sync(`${appDirectory}/src/**/*.(ts|tsx)`).length > 0;
    return {
        app,
        modules,
        command,
        appDirectory,
        zeroconfigDirectory,
        ssrEnabled,
        typescriptEnabled,
    };
};
//# sourceMappingURL=index.js.map