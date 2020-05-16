"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rimraf = void 0;
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = require("util");
exports.rimraf = util_1.promisify(rimraf_1.default);
//# sourceMappingURL=rimraf-promise.js.map