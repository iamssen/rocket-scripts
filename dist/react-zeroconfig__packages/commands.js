"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = exports.build = void 0;
const env_1 = require("@ssen/env");
const path_1 = __importDefault(require("path"));
const ramda_1 = require("ramda");
const build_1 = require("./build");
const publish_1 = require("./publish");
/* eslint-disable @typescript-eslint/typedef */
const OUT_DIR = 'OUT_DIR';
const NODE_ENV = 'NODE_ENV';
const TSCONFIG = 'TSCONFIG';
const FORCE_PUBLISH = 'FORCE_PUBLISH';
const FORCE_TAG = 'FORCE_TAG';
const FORCE_REGISTRY = 'FORCE_REGISTRY';
const defaultEnv = (env) => ({
    ...env,
    [OUT_DIR]: env[OUT_DIR] || '{cwd}/dist/packages',
});
function build({ cwd, env }) {
    const e = ramda_1.pipe(env_1.mapEnv(path_1.default.join(cwd, '.env.js')), // root env
    defaultEnv)(env);
    env_1.printEnv(OUT_DIR, NODE_ENV, TSCONFIG)(e);
    build_1.build({
        cwd,
        outDir: e[OUT_DIR],
        mode: e[NODE_ENV] === 'development' ? 'development' : 'production',
        tsconfig: e[TSCONFIG],
    });
}
exports.build = build;
function publish({ cwd, env }) {
    const e = ramda_1.pipe(env_1.mapEnv(path_1.default.join(cwd, '.env.js')), // root env
    defaultEnv)(env);
    env_1.printEnv(OUT_DIR, FORCE_PUBLISH, FORCE_TAG, FORCE_REGISTRY)(e);
    publish_1.publish({
        cwd,
        outDir: e[OUT_DIR],
        force: e[FORCE_PUBLISH] === 'true',
        tag: e[FORCE_TAG],
        registry: e[FORCE_REGISTRY],
    });
}
exports.publish = publish;
//# sourceMappingURL=commands.js.map