"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
function parseWebappArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command, app] = argv._;
    const https = (typeof argv['https-key'] === 'string' && typeof argv['https-cert'] === 'string')
        ? { key: argv['https-key'], cert: argv['https-cert'] }
        : argv['https'] === 'true';
    if (command !== 'build' && command !== 'start')
        throw new Error('command should be the build or the start');
    return {
        command,
        app,
        staticFileDirectories: argv['static-file-directories'],
        staticFilePackages: argv['static-file-packages'],
        sizeReport: argv['size-report'] !== 'false',
        compress: argv['compress'] !== 'false',
        output: argv['output'],
        vendorFileName: argv['vendor-file-name'] || 'vendor',
        styleFileName: argv['style-file-name'] || 'style',
        chunkPath: argv['chunk-path'] || '',
        port: argv['port'] || 3100,
        serverPort: argv['server-port'] || 4100,
        https,
    };
}
exports.parseWebappArgv = parseWebappArgv;
//# sourceMappingURL=parseWebappArgv.js.map