"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
module.exports = function ({ publishOptions, appDirectory, exec = child_process_1.execSync }) {
    return new Promise((resolve, reject) => {
        let i = -1;
        function func() {
            if (++i < publishOptions.length) {
                const { name } = publishOptions[i];
                try {
                    console.log(exec(process.platform === 'win32'
                        ? `cd "${path_1.default.join(appDirectory, 'dist/modules', name)}" && npm publish`
                        : `cd "${path_1.default.join(appDirectory, 'dist/modules', name)}"; npm publish;`).toString());
                    func();
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve();
            }
        }
        func();
    });
};
//# sourceMappingURL=publish.js.map