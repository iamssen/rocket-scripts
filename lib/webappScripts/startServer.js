"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const nodemon_1 = __importDefault(require("nodemon"));
const path_1 = __importDefault(require("path"));
const watingFiles_1 = require("../runners/watingFiles");
const sayTitle_1 = require("../utils/sayTitle");
// work
// - [x] wating output/server/index.js
// - [x] create symlink node_modules
// - [x] start nodemon with output/server/index.js
// staticFileDirectories
// - none of effect to this task
// sizeReport
// - none of effect to this task
// mode
// - none of effect to this task
// output
// - [x] output/server
// appFileName
// - none of effect to this task
// vendorFileName
// - none of effect to this task
// styleFileName
// - none of effect to this task
// chunkPath
// - none of effect to this task
// publicPath
// - none of effect to this task
// port
// - none of effect to this task
// serverPort
// - none of effect to this task
// https
// - none of effect to this task
// extend.serverSideRendering
// - none of effect to this task
// extend.templateFiles
// - none of effect to this task
async function startServer({ cwd, output, }) {
    const file = path_1.default.join(output, 'server/index.js');
    const dir = path_1.default.join(output, 'server');
    await watingFiles_1.watingFiles([file]);
    if (!fs_extra_1.default.pathExistsSync(path_1.default.join(output, 'server/node_modules'))) {
        await fs_extra_1.default.mkdirp(dir);
        await fs_extra_1.default.symlink(path_1.default.join(cwd, 'node_modules'), path_1.default.join(output, 'server/node_modules'));
    }
    sayTitle_1.sayTitle('START NODEMON');
    nodemon_1.default({
        watch: [dir],
        exec: `node -r ${path_1.default.dirname(require.resolve('source-map-support/package.json'))}/register ${file}`,
    });
}
exports.startServer = startServer;
//# sourceMappingURL=startServer.js.map