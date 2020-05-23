"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const rule_1 = require("@react-zeroconfig/rule");
const env_1 = require("@ssen/env");
const path_1 = __importDefault(require("path"));
const ramda_1 = require("ramda");
const start_1 = require("./start");
/* eslint-disable @typescript-eslint/typedef */
const PORT = 'PORT';
const OUT_DIR = 'OUT_DIR';
const STATIC_FILE_DIRECTORIES = 'STATIC_FILE_DIRECTORIES';
const PUBLIC_PATH = 'PUBLIC_PATH';
const CHUNK_PATH = 'CHUNK_PATH';
const SOURCE_MAP = 'SOURCE_MAP';
const HTTPS = 'HTTPS';
const HTTPS_KEY = 'HTTPS_KEY';
const HTTPS_CERT = 'HTTPS_CERT';
const EXTERNALS = 'EXTERNALS';
function start({ cwd, env, commands: [app] }) {
    const e = ramda_1.pipe(env_1.mapEnv(path_1.default.join(cwd, '.env.js')), env_1.mapEnv(path_1.default.join(cwd, 'src', app, '.env.js')), (env) => ({
        [OUT_DIR]: env[OUT_DIR] || '{cwd}/dist/{app}',
    }))(env);
    env_1.printEnv(PORT, OUT_DIR, STATIC_FILE_DIRECTORIES, PUBLIC_PATH, CHUNK_PATH, SOURCE_MAP, HTTPS, HTTPS_KEY, HTTPS_CERT, EXTERNALS)(e);
    start_1.start({
        cwd,
        app,
        outDir: e[OUT_DIR],
        publicPath: e[PUBLIC_PATH],
        chunkPath: e[CHUNK_PATH],
        staticFileDirectories: e[STATIC_FILE_DIRECTORIES]?.split(' '),
        externals: e[EXTERNALS]?.split(' '),
        port: rule_1.parseNumber(e[PORT]) || 'random',
        https: e[HTTPS_KEY] && e[HTTPS_CERT] ? { key: e[HTTPS_KEY], cert: e[HTTPS_CERT] } : e[HTTPS] === 'true',
    });
}
exports.start = start;
//# sourceMappingURL=commands.js.map