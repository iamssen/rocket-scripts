"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const types_1 = require("../types");
const takeMinimistEveryValues_1 = require("../utils/takeMinimistEveryValues");
const takeMinimistLatestValue_1 = require("../utils/takeMinimistLatestValue");
function parseWebappArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command, app] = argv._;
    const https = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
        ? { key: argv['https-key'], cert: argv['https-cert'] }
        : argv['https'] === 'true';
    if (!types_1.isWebappCommand(command)) {
        throw new Error(`command must be one of ${types_1.webappCommands.join(', ')}`);
    }
    if (!types_1.isMode(argv['mode']) && argv['mode'] !== undefined) {
        throw new Error(`mode must be one of ${types_1.modes.join(', ')}`);
    }
    return {
        command: command,
        app,
        staticFileDirectories: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-directories']),
        staticFilePackages: takeMinimistEveryValues_1.takeMinimistEveryValues(argv['static-file-packages']),
        sizeReport: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['size-report']) !== 'false',
        mode: (takeMinimistLatestValue_1.takeMinimistLatestValue(argv['mode']) || 'production'),
        output: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['output']),
        appFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['app-file-name']) || 'app',
        vendorFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['vendor-file-name']) || 'vendor',
        styleFileName: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['style-file-name']) || 'style.js',
        chunkPath: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['chunk-path']) || '',
        publicPath: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['public-path']) || '',
        port: parseInt(takeMinimistLatestValue_1.takeMinimistLatestValue(argv['port']) || '3100', 10),
        serverPort: parseInt(takeMinimistLatestValue_1.takeMinimistLatestValue(argv['server-port']) || '4100', 10),
        https,
    };
}
exports.parseWebappArgv = parseWebappArgv;
//# sourceMappingURL=parseWebappArgv.js.map