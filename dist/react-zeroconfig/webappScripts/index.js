"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webappScripts = void 0;
const multiplerun_1 = __importDefault(require("multiplerun"));
const path_1 = __importDefault(require("path"));
const rimraf_promise_1 = require("../utils/rimraf-promise");
const sayTitle_1 = require("../utils/sayTitle");
const sayZeroconfig_1 = require("../utils/sayZeroconfig");
const buildBrowser_1 = require("./buildBrowser");
const buildServer_1 = require("./buildServer");
const createWebappConfig_1 = require("./createWebappConfig");
const help_1 = __importDefault(require("./help"));
const parseWebappArgv_1 = require("./parseWebappArgv");
const startBrowser_1 = require("./startBrowser");
const startServer_1 = require("./startServer");
const watchServer_1 = require("./watchServer");
const zeroconfigPath = path_1.default.join(__dirname, '../..');
async function webappScripts(nodeArgv, { cwd = process.cwd() } = {}) {
    if (nodeArgv.indexOf('--help') > -1) {
        console.log(help_1.default);
        return;
    }
    const argv = parseWebappArgv_1.parseWebappArgv(nodeArgv);
    const config = await createWebappConfig_1.createWebappConfig({ argv, cwd, zeroconfigPath });
    if (config.command === 'start' && config.extend.serverSideRendering) {
        const argvString = nodeArgv.slice(1).join(' ');
        multiplerun_1.default([
            [
                `npx zeroconfig-webapp-scripts server-watch ${argvString} --output ${config.output}`,
                `npx zeroconfig-webapp-scripts server-start ${argvString} --output ${config.output}`,
            ],
            `npx zeroconfig-webapp-scripts browser-start ${argvString} --output ${config.output}`,
        ], cwd);
    }
    else {
        sayZeroconfig_1.sayZeroconfig();
        sayTitle_1.sayTitle('EXECUTED COMMAND');
        console.log('zeroconfig-webapp-scripts ' + nodeArgv.join(' '));
        sayTitle_1.sayTitle('CREATED CONFIG');
        console.log(config);
        switch (config.command) {
            case 'build':
                await rimraf_promise_1.rimraf(config.output);
                process.env.BROWSERSLIST_ENV = config.mode;
                await buildBrowser_1.buildBrowser(config);
                if (config.extend.serverSideRendering) {
                    process.env.BROWSERSLIST_ENV = config.mode === 'production' ? 'server' : 'server_development';
                    await buildServer_1.buildServer(config);
                }
                break;
            case 'server-watch':
                process.env.BROWSERSLIST_ENV = 'server_development';
                await watchServer_1.watchServer(config);
                break;
            case 'server-start':
                await startServer_1.startServer(config);
                break;
            case 'start':
            case 'browser-start':
                process.env.BROWSERSLIST_ENV = 'development';
                await startBrowser_1.startBrowser(config);
                break;
            default:
                console.error('Unknown command :', config.command);
        }
    }
}
exports.webappScripts = webappScripts;
//# sourceMappingURL=index.js.map