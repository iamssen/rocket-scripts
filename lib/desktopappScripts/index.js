"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiplerun_1 = __importDefault(require("multiplerun"));
const path_1 = __importDefault(require("path"));
const sayTitle_1 = require("../utils/sayTitle");
const sayZeroconfig_1 = require("../utils/sayZeroconfig");
const createDesktopappConfig_1 = require("./createDesktopappConfig");
const help_1 = __importDefault(require("./help"));
const parseDesktopappArgv_1 = require("./parseDesktopappArgv");
const startElectron_1 = require("./startElectron");
const watchElectron_1 = require("./watchElectron");
const zeroconfigPath = path_1.default.join(__dirname, '../..');
async function desktopappScripts(nodeArgv, { cwd = process.cwd() } = {}) {
    if (nodeArgv.indexOf('--help') > -1) {
        console.log(help_1.default);
        return;
    }
    const argv = parseDesktopappArgv_1.parseDesktopappArgv(nodeArgv);
    const config = await createDesktopappConfig_1.createDesktopappConfig({ argv, cwd, zeroconfigPath });
    if (config.command === 'start') {
        const argvString = nodeArgv.slice(1).join(' ');
        multiplerun_1.default([
            `npx zeroconfig-desktopapp-scripts electron-start ${argvString} --output ${config.output}`,
            `npx zeroconfig-desktopapp-scripts electron-watch ${argvString} --output ${config.output}`,
        ], cwd);
    }
    else {
        sayZeroconfig_1.sayZeroconfig();
        sayTitle_1.sayTitle('EXECUTED COMMAND');
        console.log('zeroconfig-desktopapp-scripts ' + nodeArgv.join(' '));
        sayTitle_1.sayTitle('CREATED CONFIG');
        console.log(config);
        switch (config.command) {
            case 'electron-watch':
                process.env.BROWSERSLIST_ENV = 'server_development';
                await watchElectron_1.watchElectron(config);
                break;
            case 'electron-start':
                await startElectron_1.startElectron(config);
                break;
            default:
                console.error('Unknown command :', config.command);
        }
    }
}
exports.desktopappScripts = desktopappScripts;
//# sourceMappingURL=index.js.map