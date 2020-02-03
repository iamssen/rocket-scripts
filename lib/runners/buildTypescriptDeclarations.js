"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const typescript_1 = require("typescript");
async function buildTypescriptDeclarations({ file, name, compilerOptions, cwd, typeRoots, declarationDir }) {
    const options = {
        ...compilerOptions,
        allowJs: false,
        module: typescript_1.ModuleKind.CommonJS,
        target: typescript_1.ScriptTarget.ESNext,
        moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
        skipLibCheck: true,
        sourceMap: false,
        resolveJsonModule: true,
        typeRoots: [
            ...(compilerOptions.typeRoots || []),
            path_1.default.join(cwd, 'node_modules/@types'),
            ...typeRoots,
        ],
        declaration: true,
        emitDeclarationOnly: true,
        baseUrl: path_1.default.dirname(file),
        declarationDir,
        paths: fs_extra_1.default.existsSync(path_1.default.join(cwd, 'dist/packages')) ? {
            '*': [
                path_1.default.relative(path_1.default.dirname(file), path_1.default.join(cwd, 'dist/packages/*')),
            ],
        } : {},
    };
    console.log(options);
    const program = typescript_1.createProgram([file], options);
    const emitResult = program.emit();
    const diagnostics = typescript_1.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    for (const diagnostic of diagnostics) {
        if (diagnostic.file && diagnostic.start) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = typescript_1.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(`TS${diagnostic.code} : ${typescript_1.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
    }
    if (emitResult.emitSkipped) {
        throw new Error(`Build the declaration files of "${name}" is failed`);
    }
}
exports.buildTypescriptDeclarations = buildTypescriptDeclarations;
//# sourceMappingURL=buildTypescriptDeclarations.js.map