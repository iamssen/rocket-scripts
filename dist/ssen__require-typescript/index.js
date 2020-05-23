"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTypescript = void 0;
const fs_1 = __importDefault(require("fs"));
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const typescript_1 = require("typescript");
function requireTypescript(file) {
    if (!fs_1.default.existsSync(file)) {
        throw new Error(`undefined typescript file ${file}`);
    }
    const source = fs_1.default.readFileSync(file, { encoding: 'utf-8' });
    const result = typescript_1.transpileModule(source, {
        compilerOptions: {
            downlevelIteration: true,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            module: typescript_1.ModuleKind.CommonJS,
            skipLibCheck: true,
        },
    });
    if (result.diagnostics && result.diagnostics.length > 0) {
        console.warn(result.diagnostics);
    }
    //@ts-ignore hidden api
    const paths = module_1.default._nodeModulePaths(path_1.default.dirname(file));
    const parent = module.parent;
    const m = new module_1.default(file, parent || undefined);
    m.filename = file;
    m.paths = paths;
    //@ts-ignore hidden api
    m._compile(result.outputText, file);
    return m.exports;
}
exports.requireTypescript = requireTypescript;
//# sourceMappingURL=index.js.map