"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tmp_1 = __importDefault(require("tmp"));
const glob_promise_1 = require("../utils/glob-promise");
const getStaticFileDirectories_1 = require("../webappScripts/getStaticFileDirectories");
async function createDesktopappConfig({ argv, cwd, zeroconfigPath }) {
    const { command, app } = argv;
    if (!(await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'src', app))))
        throw new Error(`${path_1.default.join(cwd, 'src', app)} is undefined`);
    const staticFileDirectories = await getStaticFileDirectories_1.getStaticFileDirectories({ ...argv, cwd });
    const output = typeof argv.output === 'string'
        ? path_1.default.resolve(cwd, argv.output)
        : command === 'start'
            ? tmp_1.default.dirSync().name
            : path_1.default.join(cwd, 'dist', app);
    const templateFiles = (await glob_promise_1.glob(`${cwd}/src/${app}/*.html`)).map(file => path_1.default.basename(file));
    return {
        command,
        app,
        staticFileDirectories,
        output,
        cwd,
        zeroconfigPath,
        extend: {
            templateFiles,
        },
    };
}
exports.createDesktopappConfig = createDesktopappConfig;
//# sourceMappingURL=createDesktopappConfig.js.map