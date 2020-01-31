"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const types_1 = require("../types");
const sayTitle_1 = require("../utils/sayTitle");
const takeMinimistEveryValues_1 = require("../utils/takeMinimistEveryValues");
const takeMinimistLatestValue_1 = require("../utils/takeMinimistLatestValue");
function parseExtensionArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command, app] = argv._;
    if (!types_1.isExtensionCommand(command)) {
        throw new Error(`command must be one of ${types_1.extensionCommands.join(', ')}`);
    }
    switch (command) {
        case 'build':
            if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
                sayTitle_1.sayTitle('FOUND NODE_ENV');
                console.log(`In "zeroconfig-extension-scripts ${command}". NODE_ENV should always be "production"`);
                console.log('[setting change]: process.env.NODE_ENV → production');
            }
            process.env.NODE_ENV = 'production';
            break;
        case 'watch':
            if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
                sayTitle_1.sayTitle('FOUND NODE_ENV');
                console.log(`In "zeroconfig-extension-scripts ${command}". NODE_ENV should always be "development"`);
                console.log('[setting change]: process.env.NODE_ENV → development');
            }
            process.env.NODE_ENV = 'development';
            break;
        default:
            throw new Error(`command must be one of ${types_1.extensionCommands.join(', ')}`);
    }
    return {
        command: command,
        app,
        output: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['output']),
        vendorFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
        styleFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
        staticFileDirectories: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-directories']),
        staticFilePackages: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-packages']),
    };
}
exports.parseExtensionArgv = parseExtensionArgv;
//# sourceMappingURL=parseExtensionArgv.js.map