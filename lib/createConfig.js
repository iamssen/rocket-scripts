"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getDefaultEntry(appDirectory) {
    const entryDirectories = fs_1.default.readdirSync(path_1.default.join(appDirectory, 'src/_entry/client'));
    const entry = [];
    for (const entryName of entryDirectories) {
        if (fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_entry/client', entryName)).isDirectory()) {
            entry.push(entryName);
        }
    }
    return entry;
}
function getDefaultModulesEntry(appDirectory) {
    if (!fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_modules')) || !fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_modules')).isDirectory())
        return {};
    const entryDirectories = fs_1.default.readdirSync(path_1.default.join(appDirectory, 'src/_modules'));
    const entry = {};
    for (const entryName of entryDirectories) {
        if (fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_modules', entryName)).isDirectory()) {
            entry[entryName] = {};
        }
    }
    return entry;
}
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
        entry: getDefaultEntry(appDirectory),
        port: 3100,
        staticFileDirectories: ['public'],
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
        entry: getDefaultModulesEntry(appDirectory),
        ...(userConfig.modules || {}),
    };
    const ssrEnabled = fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_entry/ssr')) && fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_entry/ssr')).isDirectory();
    return {
        app,
        modules,
        command,
        appDirectory,
        zeroconfigDirectory,
        ssrEnabled,
    };
};
//# sourceMappingURL=createConfig.js.map