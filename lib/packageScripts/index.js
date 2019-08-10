"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfonts_1 = require("cfonts");
const sayTitle_1 = require("../utils/sayTitle");
const buildPackages_1 = require("./buildPackages");
const help_1 = __importDefault(require("./help"));
const parsePackageArgv_1 = require("./parsePackageArgv");
const publishPackages_1 = require("./publishPackages");
const validatePackages_1 = require("./validatePackages");
async function packageScripts(nodeArgv, { cwd = process.cwd() } = {}) {
    if (nodeArgv.indexOf('--help') > -1) {
        console.log(help_1.default);
        return;
    }
    const { command } = parsePackageArgv_1.parsePackageArgv(nodeArgv);
    cfonts_1.say('ZEROCONFIG', { font: 'block' });
    sayTitle_1.sayTitle('EXECUTED COMMAND');
    console.log('zeroconfig-package-scripts ' + nodeArgv.join(' '));
    if (command === 'build') {
        process.env.BROWSERSLIST_ENV = 'package';
        await buildPackages_1.buildPackages({ cwd });
    }
    else if (command === 'publish') {
        await publishPackages_1.publishPackages({ cwd });
    }
    else if (command === 'validate') {
        await validatePackages_1.validatePackages({ cwd });
    }
    else {
        console.error('Unknown command :', command);
    }
}
exports.packageScripts = packageScripts;
//# sourceMappingURL=index.js.map