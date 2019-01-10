"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
function getDefaultEntry(appDirectory) {
    const entryDirectories = fs_1.default.readdirSync(`${appDirectory}/src/_entry/client`);
    const entry = [];
    for (const entryName of entryDirectories) {
        if (fs_1.default.statSync(`${appDirectory}/src/_entry/client/${entryName}`).isDirectory()) {
            entry.push(entryName);
        }
    }
    return entry;
}
function getDefaultModulesEntry(appDirectory) {
    if (!fs_1.default.existsSync(`${appDirectory}/src/_modules`) || !fs_1.default.statSync(`${appDirectory}/src/_modules`).isDirectory())
        return {};
    const entryDirectories = fs_1.default.readdirSync(`${appDirectory}/src/_modules`);
    const entry = {};
    for (const entryName of entryDirectories) {
        if (fs_1.default.statSync(`${appDirectory}/src/_modules/${entryName}`).isDirectory()) {
            entry[entryName] = {};
        }
    }
    return entry;
}
module.exports = function ({ command, appDirectory, ssenpackDirectory }) {
    // tslint:disable:no-any
    const packageJson = require(`${appDirectory}/package.json`);
    // tslint:enable:no-any
    const userConfig = fs_1.default.existsSync(`${process.cwd()}/ssenpack.local.config.js`)
        ? require(`${appDirectory}/ssenpack.local.config.js`)
        : fs_1.default.existsSync(`${process.cwd()}/ssenpack.config.js`)
            ? require(`${appDirectory}/ssenpack.config.js`)
            : packageJson.ssenpack || {};
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
    const ssrEnabled = fs_1.default.existsSync(`${appDirectory}/src/_entry/ssr`) && fs_1.default.statSync(`${appDirectory}/src/_entry/ssr`).isDirectory();
    return {
        app,
        modules,
        command,
        appDirectory,
        ssenpackDirectory,
        ssrEnabled,
    };
};
//# sourceMappingURL=createConfig.js.map