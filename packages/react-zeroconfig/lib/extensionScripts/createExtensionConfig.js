"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_promise_1 = require("../utils/glob-promise");
const getStaticFileDirectories_1 = require("../webappScripts/getStaticFileDirectories");
async function createExtensionConfig({ argv, cwd, zeroconfigPath, }) {
    const { command, app, vendorFileName, styleFileName } = argv;
    if (!(await fs_extra_1.default.pathExists(path_1.default.join(cwd, 'src', app))))
        throw new Error(`${path_1.default.join(cwd, 'src', app)} is undefined`);
    const staticFileDirectories = await getStaticFileDirectories_1.getStaticFileDirectories({ ...argv, cwd });
    const output = typeof argv.output === 'string' ? path_1.default.resolve(cwd, argv.output) : path_1.default.join(cwd, 'dist-dev', app);
    const templateFiles = (await glob_promise_1.glob(`${cwd}/src/${app}/*.html`)).map((file) => path_1.default.basename(file));
    const entryFiles = (await glob_promise_1.glob(`${cwd}/src/${app}/*.{js,jsx,ts,tsx}`)).map((file) => path_1.default.basename(file));
    return {
        command,
        app,
        staticFileDirectories,
        output,
        vendorFileName,
        styleFileName,
        entryFiles,
        cwd,
        zeroconfigPath,
        extend: {
            templateFiles,
        },
    };
}
exports.createExtensionConfig = createExtensionConfig;
//# sourceMappingURL=createExtensionConfig.js.map