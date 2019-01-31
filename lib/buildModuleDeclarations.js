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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importStar(require("typescript"));
function replaceUndefined(v, defaultValue) {
    return v === undefined ? defaultValue : v;
}
// tslint:disable:no-any
function getCompilerOptions(tsconfigPath) {
    const tsconfigText = fs_extra_1.default.readFileSync(tsconfigPath, { encoding: 'utf8' });
    return typescript_1.default.parseConfigFileTextToJson(tsconfigPath, tsconfigText).config.compilerOptions;
}
module.exports = function ({ buildOption, appDirectory }) {
    if (!buildOption.declaration)
        return Promise.resolve();
    return new Promise((resolve, reject) => {
        const { jsx, experimentalDecorators, allowJs, downlevelIteration, importHelpers, resolveJsonModule, allowSyntheticDefaultImports, esModuleInterop, alwaysStrict, strictNullChecks, strictBindCallApply, strictFunctionTypes, strictPropertyInitialization, lib, } = getCompilerOptions(path_1.default.join(appDirectory, 'tsconfig.json'));
        const { jsx: jsxDefault, experimentalDecorators: experimentalDecoratorsDefault, allowJs: allowJsDefault, downlevelIteration: downlevelIterationDefault, importHelpers: importHelpersDefault, resolveJsonModule: resolveJsonModuleDefault, allowSyntheticDefaultImports: allowSyntheticDefaultImportsDefault, esModuleInterop: esModuleInteropDefault, alwaysStrict: alwaysStrictDefault, strictNullChecks: strictNullChecksDefault, strictBindCallApply: strictBindCallApplyDefault, strictFunctionTypes: strictFunctionTypesDefault, strictPropertyInitialization: strictPropertyInitializationDefault, lib: libDefault, } = getCompilerOptions(path_1.default.join(__dirname, '../configs/tsconfig.json'));
        const program = typescript_1.default.createProgram([buildOption.file], {
            // language setting
            jsx: replaceUndefined(jsx, jsxDefault) ? typescript_1.JsxEmit.React : typescript_1.JsxEmit.None,
            experimentalDecorators: replaceUndefined(experimentalDecorators, experimentalDecoratorsDefault),
            allowJs: replaceUndefined(allowJs, allowJsDefault),
            downlevelIteration: replaceUndefined(downlevelIteration, downlevelIterationDefault),
            importHelpers: replaceUndefined(importHelpers, importHelpersDefault),
            allowSyntheticDefaultImports: replaceUndefined(allowSyntheticDefaultImports, allowSyntheticDefaultImportsDefault),
            resolveJsonModule: replaceUndefined(resolveJsonModule, resolveJsonModuleDefault),
            esModuleInterop: replaceUndefined(esModuleInterop, esModuleInteropDefault),
            alwaysStrict: replaceUndefined(alwaysStrict, alwaysStrictDefault),
            strictNullChecks: replaceUndefined(strictNullChecks, strictNullChecksDefault),
            strictBindCallApply: replaceUndefined(strictBindCallApply, strictBindCallApplyDefault),
            strictFunctionTypes: replaceUndefined(strictFunctionTypes, strictFunctionTypesDefault),
            strictPropertyInitialization: replaceUndefined(strictPropertyInitialization, strictPropertyInitializationDefault),
            module: typescript_1.ModuleKind.CommonJS,
            target: typescript_1.ScriptTarget.ESNext,
            moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            sourceMap: false,
            lib: replaceUndefined(lib, libDefault).map((l) => `lib.${l}.d.ts`),
            // declaration setting
            typeRoots: [
                path_1.default.join(appDirectory, 'node_modules/@types'),
                path_1.default.join(appDirectory, 'dist/modules'),
            ],
            declaration: true,
            emitDeclarationOnly: true,
            baseUrl: path_1.default.join(appDirectory, `src/_modules/${buildOption.name}`),
            declarationDir: path_1.default.join(appDirectory, `dist/modules/${buildOption.name}`),
        });
        const emitResult = program.emit();
        const diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        for (const diagnostic of diagnostics) {
            if (diagnostic.file && diagnostic.start) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                console.log(`🌧 ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.log(`🌧 ${typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
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
//# sourceMappingURL=buildModuleDeclarations.js.map