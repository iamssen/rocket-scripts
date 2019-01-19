"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const path_1 = __importDefault(require("path"));
const typescript_1 = __importStar(require("typescript"));
module.exports = function ({ file, appDirectory }) {
    const program = typescript_1.default.createProgram([file], {
        jsx: typescript_1.JsxEmit.React,
        experimentalDecorators: true,
        allowJs: false,
        downlevelIteration: true,
        importHelpers: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        alwaysStrict: true,
        strictNullChecks: true,
        strictBindCallApply: true,
        strictFunctionTypes: false,
        strictPropertyInitialization: true,
        module: typescript_1.ModuleKind.CommonJS,
        target: typescript_1.ScriptTarget.ESNext,
        moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
        skipLibCheck: true,
        sourceMap: true,
        lib: [
            'dom',
            'dom.iterable',
            'esnext',
        ],
        typeRoots: [
            path_1.default.join(appDirectory, 'node_modules/@types'),
            path_1.default.join(appDirectory, 'dist/libs'),
        ],
    });
    return new Promise((resolve, reject) => {
    });
};
//# sourceMappingURL=buildTypescriptDeclarations.js.map