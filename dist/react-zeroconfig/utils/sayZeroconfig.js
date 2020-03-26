"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfonts_1 = require("cfonts");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function sayZeroconfig() {
    cfonts_1.say('ZERO\nCONFIG', { font: 'block' });
    const file = path_1.default.join(__dirname, '../package.json');
    const { version } = fs_extra_1.default.existsSync(file) ? fs_extra_1.default.readJsonSync(file) : { version: '0.0.0-test.0' };
    console.log(`${version}`);
}
exports.sayZeroconfig = sayZeroconfig;
//# sourceMappingURL=sayZeroconfig.js.map