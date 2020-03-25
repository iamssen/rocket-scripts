"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const gzip_size_1 = __importDefault(require("gzip-size"));
const path_1 = __importDefault(require("path"));
function log(message, level) {
    if (level === 'error') {
        throw new Error(message);
    }
    else {
        console.warn(message);
    }
}
function test(config, { cwd = process.cwd() }) {
    Object.keys(config).forEach((filename) => {
        const { level = 'error', maxGzipSize, maxSize } = config[filename];
        const files = glob_1.default.sync(filename, { cwd });
        for (const file of files) {
            if (typeof maxSize === 'number') {
                const stat = fs_1.default.statSync(path_1.default.join(cwd, file));
                if (stat.size > maxSize) {
                    log(`the file size of "${file}" is ${stat.size}. it is higher than ${maxSize}`, level);
                }
            }
            else if (typeof maxGzipSize === 'number') {
                const size = gzip_size_1.default.fileSync(path_1.default.join(cwd, file));
                if (size > maxGzipSize) {
                    log(`the gzip size of "${file}" is ${size}. it is higher than ${maxGzipSize}`, level);
                }
            }
        }
    });
}
exports.test = test;
function testByConfig({ cwd = process.cwd() }) {
    const configFile = path_1.default.join(cwd, 'filesize-test.json');
    if (!fs_1.default.existsSync(configFile)) {
        throw new Error(`Undefined ${configFile}`);
    }
    const config = JSON.parse(fs_1.default.readFileSync(configFile, { encoding: 'utf8' }));
    test(config, { cwd });
}
exports.testByConfig = testByConfig;
//# sourceMappingURL=index.js.map