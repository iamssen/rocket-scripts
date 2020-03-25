"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/typedef */
exports.packageCommands = ['build', 'publish', 'validate', 'list', 'sync'];
exports.webappCommands = ['build', 'start', 'server-watch', 'server-start', 'browser-start'];
exports.desktopappCommands = ['build', 'start', 'electron-watch', 'electron-start'];
exports.extensionCommands = ['build', 'watch'];
exports.modes = ['production', 'development'];
const packageCommandSet = new Set(exports.packageCommands);
const webappCommandSet = new Set(exports.webappCommands);
const desktopappCommandSet = new Set(exports.desktopappCommands);
const extensionCommandSet = new Set(exports.extensionCommands);
const modeSet = new Set(exports.modes);
function isPackageCommand(command) {
    return packageCommandSet.has(command);
}
exports.isPackageCommand = isPackageCommand;
function isWebappCommand(command) {
    return webappCommandSet.has(command);
}
exports.isWebappCommand = isWebappCommand;
function isDesktopappCommand(command) {
    return desktopappCommandSet.has(command);
}
exports.isDesktopappCommand = isDesktopappCommand;
function isExtensionCommand(command) {
    return extensionCommandSet.has(command);
}
exports.isExtensionCommand = isExtensionCommand;
function isMode(mode) {
    return mode ? modeSet.has(mode) : false;
}
exports.isMode = isMode;
//# sourceMappingURL=types.js.map