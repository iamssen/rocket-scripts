"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const types_1 = require("../types");
const takeEvery_1 = require("./takeEvery");
const takeLatest_1 = require("./takeLatest");
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
        staticFileDirectories: takeEvery_1.takeEvery(argv['static-file-directories']),
        staticFilePackages: takeEvery_1.takeEvery(argv['static-file-packages']),
        sizeReport: takeLatest_1.takeLatest(argv['size-report']) !== 'false',
        mode: takeLatest_1.takeLatest(argv['mode']) || 'production',
        output: takeLatest_1.takeLatest(argv['output']),
        appFileName: takeLatest_1.takeLatest(argv['app-file-name']) || 'main',
        vendorFileName: takeLatest_1.takeLatest(argv['vendor-file-name']) || 'vendor',
        styleFileName: takeLatest_1.takeLatest(argv['style-file-name']) || 'style',
        chunkPath: takeLatest_1.takeLatest(argv['chunk-path']) || '',
        publicPath: takeLatest_1.takeLatest(argv['public-path']) || '',
        port: takeLatest_1.takeLatest(argv['port']) || 3100,
        serverPort: takeLatest_1.takeLatest(argv['server-port']) || 4100,
        https,
    };
}
exports.parseWebappArgv = parseWebappArgv;
//# sourceMappingURL=parseWebappArgv.js.map