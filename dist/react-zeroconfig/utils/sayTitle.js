"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sayTitle = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
function sayTitle(title) {
    console.log('');
    console.log(moment_1.default().format('HH:mm:ss'), ':', chalk_1.default.bold(title));
    console.log('='.repeat(50) + '-'.repeat(25));
}
exports.sayTitle = sayTitle;
//# sourceMappingURL=sayTitle.js.map