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
function parseDesktopappArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command, app] = argv._;
    if (!types_1.isDesktopappCommand(command)) {
        throw new Error(`command must be one of ${types_1.desktopappCommands.join(', ')}`);
    }
    const inputMode = takeMinimistLatestValue_1.takeMinimistLatestValue(argv['mode']);
    if (inputMode !== undefined && !types_1.isMode(inputMode)) {
        throw new Error(`mode must be one of ${types_1.modes.join(', ')}`);
    }
    switch (command) {
        case 'build':
            if (process.env.NODE_ENV && types_1.isMode(process.env.NODE_ENV)) {
                if (types_1.isMode(inputMode) && process.env.NODE_ENV !== inputMode) {
                    sayTitle_1.sayTitle('FOUND NODE_ENV');
                    console.log('if NODE_ENV and --mode are entered differently, NODE_ENV takes precedence.');
                    console.log(`[setting change]: --mode → ${process.env.NODE_ENV}`);
                }
            }
            else if (!process.env.NODE_ENV && types_1.isMode(inputMode)) {
                process.env.NODE_ENV = inputMode;
            }
            else {
                process.env.NODE_ENV = 'production';
            }
            break;
        case 'start':
        case 'electron-watch':
        case 'electron-start':
            if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
                sayTitle_1.sayTitle('FOUND NODE_ENV');
                console.log(`In "zeroconfig-desktopapp-scripts ${command}". NODE_ENV should always be "development"`);
                console.log('[setting change]: process.env.NODE_ENV → development');
            }
            process.env.NODE_ENV = 'development';
            break;
        default:
            throw new Error(`command must be one of ${types_1.desktopappCommands.join(', ')}`);
    }
    return {
        command: command,
        app,
        sourceMap: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['source-map']) === 'true'
            ? true
            : takeMinimistLatestValue_1.takeMinimistLatestValue(argv['source-map']) === 'false'
                ? false
                : undefined,
        staticFileDirectories: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-directories']),
        staticFilePackages: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-packages']),
        output: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['output']),
        mode: process.env.NODE_ENV,
    };
}
exports.parseDesktopappArgv = parseDesktopappArgv;
//# sourceMappingURL=parseDesktopappArgv.js.map