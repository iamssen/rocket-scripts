"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
function parsePackageArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command] = argv._;
    if (command !== 'build' && command !== 'publish')
        throw new Error('command should be the build or the publish');
    return {
        command,
    };
}
exports.parsePackageArgv = parsePackageArgv;
//# sourceMappingURL=parsePackageArgv.js.map