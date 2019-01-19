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
module.exports = function ({ buildOption, appDirectory }) {
    const program = typescript_1.default.createProgram([buildOption.file], {
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
            path_1.default.join(appDirectory, 'dist/modules'),
        ],
        declaration: true,
        baseUrl: path_1.default.join(appDirectory, `src/_modules/${buildOption.name}`),
        declarationDir: path_1.default.join(appDirectory, `dist/modules/${buildOption.name}`),
        outDir: path_1.default.join(appDirectory, `dist/modules/_cache/${buildOption.name}`),
    });
    return new Promise((resolve, reject) => {
        const emitResult = program.emit();
        const diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        for (const diagnostic of diagnostics) {
            if (diagnostic.file && diagnostic.start) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                console.log(`⚙️ ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.log(`⚙️ ${typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
            }
        }
        if (emitResult.emitSkipped) {
            reject(new Error(`💀 Build the declaration files of "${buildOption.name}" is failed`));
        }
        else {
            console.log(`👍 Build the declaration files of "${buildOption.name}" is successful`);
            resolve();
        }
    });
};
//# sourceMappingURL=buildTypescriptDeclarations.js.map