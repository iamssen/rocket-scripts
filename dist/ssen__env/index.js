"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printEnv = exports.patchEnv = exports.mapEnv = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.mapEnv = (envFile) => (env) => {
    const file = path_1.default.join(process.cwd(), envFile);
    if (!fs_1.default.existsSync(file))
        return env;
    return require(file)(env);
};
exports.patchEnv = (origin = {}) => (env) => {
    Object.keys(env).forEach((key) => {
        if (env[key] && env[key] !== origin[key]) {
            process.env[key] = env[key];
        }
    });
};
exports.printEnv = (...keys) => (env) => {
    const picked = Object.keys(env)
        .filter((key) => keys.indexOf(key) > -1)
        .reduce((picked, key) => {
        picked[key] = env[key];
        return picked;
    }, {});
    console.log(JSON.stringify(picked, null, 2));
};
//# sourceMappingURL=index.js.map