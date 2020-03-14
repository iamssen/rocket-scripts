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
function parseWebappArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command, app] = argv._;
    if (!types_1.isWebappCommand(command)) {
        throw new Error(`command must be one of ${types_1.webappCommands.join(', ')}`);
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
        case 'server-watch':
        case 'server-start':
        case 'browser-start':
            if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
                sayTitle_1.sayTitle('FOUND NODE_ENV');
                console.log(`In "zeroconfig-webapp-scripts ${command}". NODE_ENV should always be "development"`);
                console.log('[setting change]: process.env.NODE_ENV → development');
            }
            process.env.NODE_ENV = 'development';
            break;
        default:
            throw new Error(`command must be one of ${types_1.webappCommands.join(', ')}`);
    }
    const https = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
        ? { key: argv['https-key'], cert: argv['https-cert'] }
        : argv['https'] === 'true';
    let chunkPath = (takeMinimistLatestValue_1.takeMinimistLatestValue(argv['chunk-path']) || '').trim();
    if (chunkPath.length > 0 && !/\/$/.test(chunkPath)) {
        chunkPath = chunkPath + '/';
    }
    const defaultPort = process.env.PORT || '3100';
    const defaultServerPort = process.env.SERVER_PORT || '4100';
    return {
        command: command,
        app,
        sourceMap: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['source-map']) === 'true' ? true : takeMinimistLatestValue_1.takeMinimistLatestValue(argv['source-map']) === 'false' ? false : undefined,
        staticFileDirectories: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-directories']),
        staticFilePackages: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-packages']),
        sizeReport: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['size-report']) === 'true',
        mode: process.env.NODE_ENV,
        output: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['output']),
        appFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['app-file-name']) || 'app',
        vendorFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
        styleFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
        chunkPath,
        publicPath: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['public-path']) || '',
        internalEslint: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['internal-eslint']) !== 'false',
        port: parseInt(takeMinimistLatestValue_1.takeMinimistLatestValue(argv['port']) || defaultPort, 10),
        serverPort: parseInt(takeMinimistLatestValue_1.takeMinimistLatestValue(argv['server-port']) || defaultServerPort, 10),
        https,
    };
}
exports.parseWebappArgv = parseWebappArgv;
//# sourceMappingURL=parseWebappArgv.js.map