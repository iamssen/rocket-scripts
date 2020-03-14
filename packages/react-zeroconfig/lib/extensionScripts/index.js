"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const help_1 = __importDefault(require("../extensionScripts/help"));
const sayTitle_1 = require("../utils/sayTitle");
const sayZeroconfig_1 = require("../utils/sayZeroconfig");
const buildExtension_1 = require("./buildExtension");
const createExtensionConfig_1 = require("./createExtensionConfig");
const parseExtensionArgv_1 = require("./parseExtensionArgv");
const watchExtension_1 = require("./watchExtension");
const zeroconfigPath = path_1.default.join(__dirname, '../..');
async function extensionScripts(nodeArgv, { cwd = process.cwd() } = {}) {
    if (nodeArgv.indexOf('--help') > -1) {
        console.log(help_1.default);
        return;
    }
    const argv = parseExtensionArgv_1.parseExtensionArgv(nodeArgv);
    const config = await createExtensionConfig_1.createExtensionConfig({ argv, cwd, zeroconfigPath });
    sayZeroconfig_1.sayZeroconfig();
    sayTitle_1.sayTitle('EXECUTED COMMAND');
    console.log('zeroconfig-extension-scripts ' + nodeArgv.join(' '));
    sayTitle_1.sayTitle('CREATED CONFIG');
    console.log(config);
    switch (config.command) {
        case 'build':
            process.env.BROWSERSLIST_ENV = 'development';
            await buildExtension_1.buildExtension(config);
            break;
        case 'watch':
            process.env.BROWSERSLIST_ENV = 'development';
            await watchExtension_1.watchExtension(config);
            break;
        default:
            console.error('Unknown command :', config.command);
    }
}
exports.extensionScripts = extensionScripts;
//# sourceMappingURL=index.js.map