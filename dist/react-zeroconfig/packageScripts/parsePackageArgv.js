"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const types_1 = require("../types");
const takeMinimistLatestValue_1 = require("../utils/takeMinimistLatestValue");
function parsePackageArgv(nodeArgv) {
    const argv = minimist_1.default(nodeArgv);
    const [command] = argv._;
    if (!types_1.isPackageCommand(command)) {
        throw new Error(`command must be one of ${types_1.packageCommands.join(', ')}`);
    }
    return {
        command: command,
        choice: takeMinimistLatestValue_1.takeMinimistLatestValue(argv['choice']) !== 'false',
    };
}
exports.parsePackageArgv = parsePackageArgv;
//# sourceMappingURL=parsePackageArgv.js.map