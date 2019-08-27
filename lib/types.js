"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:typedef
exports.packageCommands = ['build', 'publish', 'validate', 'list', 'sync'];
exports.webappCommands = ['build', 'start', 'server-watch', 'server-start', 'browser-start'];
exports.modes = ['production', 'development'];
const packageCommandSet = new Set(exports.packageCommands);
const webappCommandSet = new Set(exports.webappCommands);
const modeSet = new Set(exports.modes);
function isPackageCommand(command) {
    return packageCommandSet.has(command);
}
exports.isPackageCommand = isPackageCommand;
function isWebappCommand(command) {
    return webappCommandSet.has(command);
}
exports.isWebappCommand = isWebappCommand;
function isMode(mode) {
    return mode ? modeSet.has(mode) : false;
}
exports.isMode = isMode;
//# sourceMappingURL=types.js.map