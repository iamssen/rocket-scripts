"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_promise_1 = require("../utils/glob-promise");
const getStaticFileDirectories_1 = require("./getStaticFileDirectories");
async function createWebappConfig({ argv, cwd, zeroconfigPath }) {
    const { command, app, sizeReport, compress, vendorFileName, styleFileName, chunkPath, port, serverPort, https } = argv;
    if (await !fs_extra_1.default.pathExists(path_1.default.join(cwd, app)))
        throw new Error(`${path_1.default.join(cwd, app)} is undefined`);
    const staticFileDirectories = await getStaticFileDirectories_1.getStaticFileDirectories({ argv, cwd });
    const output = typeof argv.output === 'string'
        ? path_1.default.join(cwd, argv.output)
        : path_1.default.join(cwd, 'dist', app);
    const serverEnabled = (await glob_promise_1.glob(`${cwd}/src/${app}/server.(js|jsx|ts|tsx)`)).length > 0;
    return {
        command,
        app,
        staticFileDirectories,
        sizeReport,
        compress,
        output,
        vendorFileName,
        styleFileName,
        chunkPath,
        port,
        serverPort,
        https,
        cwd,
        zeroconfigPath,
        serverEnabled,
    };
}
exports.createWebappConfig = createWebappConfig;
//# sourceMappingURL=createWebappConfig.js.map