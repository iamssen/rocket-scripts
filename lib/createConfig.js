"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
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
    if (!fs_1.default.existsSync(path_1.default.join(appDirectory, 'src/_modules')) || !fs_1.default.statSync(path_1.default.join(appDirectory, 'src/_modules')).isDirectory()) {
        return [];
    }
    return glob_1.default
        .sync(`${appDirectory}/src/_modules/**/package.json`)
        .map((packageJsonPath) => path_1.default.dirname(packageJsonPath))
        .map((dirname) => path_1.default.relative(path_1.default.join(appDirectory, 'src/_modules'), dirname).split(path_1.default.sep))
        .map((dirnamePaths) => dirnamePaths.join('/'));
}
function getDefaultModulePublics(appDirectory) {
    return getDefaultModulesEntry(appDirectory)
        .map((moduleName) => path_1.default.join(appDirectory, `src/_modules/${moduleName}/public`))
        .filter((publicPath) => fs_1.default.existsSync(publicPath) && fs_1.default.statSync(publicPath).isDirectory())
        .map((publicPath) => path_1.default.relative(appDirectory, publicPath).split(path_1.default.sep).join('/'));
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
        staticFileDirectories: ['public'].concat(getDefaultModulePublics(appDirectory)),
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