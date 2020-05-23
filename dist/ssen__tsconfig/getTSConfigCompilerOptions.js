"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTSConfigCompilerOptions = void 0;
const typescript_1 = require("typescript");
const parseConfigHost = {
    fileExists: typescript_1.sys.fileExists,
    readFile: typescript_1.sys.readFile,
    readDirectory: typescript_1.sys.readDirectory,
    useCaseSensitiveFileNames: true,
};
function getTSConfigCompilerOptions({ cwd, configName = 'tsconfig.json' }) {
    const configFileName = typescript_1.findConfigFile(cwd, typescript_1.sys.fileExists, configName);
    if (!configFileName)
        throw new Error(`Undefined "${configName}" file on "${cwd}"`);
    const { config, error } = typescript_1.readConfigFile(configFileName, typescript_1.sys.readFile);
    if (error) {
        throw error;
    }
    else if (!config) {
        throw new Error(`It was not generated config from readConfigFile("${configFileName}")`);
    }
    const { options } = typescript_1.parseJsonConfigFileContent(config, parseConfigHost, cwd);
    return options;
}
exports.getTSConfigCompilerOptions = getTSConfigCompilerOptions;
//# sourceMappingURL=getTSConfigCompilerOptions.js.map