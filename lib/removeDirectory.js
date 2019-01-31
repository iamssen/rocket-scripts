"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const rimraf_1 = __importDefault(require("rimraf"));
module.exports = function (path) {
    return new Promise((resolve, reject) => {
        rimraf_1.default(path, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};
//# sourceMappingURL=removeDirectory.js.map