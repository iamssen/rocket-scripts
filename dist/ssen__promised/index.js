"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rimraf = exports.glob = exports.exec = void 0;
const child_process_1 = require("child_process");
const glob_1 = __importDefault(require("glob"));
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = require("util");
exports.exec = util_1.promisify(child_process_1.exec);
exports.glob = util_1.promisify(glob_1.default);
exports.rimraf = util_1.promisify(rimraf_1.default);
//# sourceMappingURL=index.js.map