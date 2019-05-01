"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
exports.glob = util_1.promisify(glob_1.default);
//# sourceMappingURL=glob-promise.js.map