"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const nodemon_1 = __importDefault(require("nodemon"));
const path_1 = __importDefault(require("path"));
const watingFiles_1 = require("../runners/watingFiles");
const sayTitle_1 = require("../utils/sayTitle");
async function startServer({ cwd, output }) {
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