"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const buildTypescriptDeclarations_1 = require("../runners/buildTypescriptDeclarations");
const fsCopySourceFilter_1 = require("../runners/fsCopySourceFilter");
const runWebpack_1 = require("../runners/runWebpack");
const getTSConfigCompilerOptions_1 = require("../transpile/getTSConfigCompilerOptions");
const rimraf_promise_1 = require("../utils/rimraf-promise");
const sayTitle_1 = require("../utils/sayTitle");
const createWebpackBaseConfig_1 = require("../webpackConfigs/createWebpackBaseConfig");
const createWebpackPackageConfig_1 = require("../webpackConfigs/createWebpackPackageConfig");
const createPackageBuildOptions_1 = require("./createPackageBuildOptions");
const zeroconfigPath = path_1.default.join(__dirname, '../..');
async function buildPackages({ cwd }) {
    try {
        await rimraf_promise_1.rimraf(path_1.default.join(cwd, 'dist/packages'));
        const entry = await getInternalPackageEntry_1.getInternalPackageEntry({ packageDir: path_1.default.join(cwd, 'src/_packages') });
        const buildOptions = await createPackageBuildOptions_1.createPackageBuildOptions({ entry, cwd });
        for await (const { name, file, externals, buildTypescriptDeclaration } of buildOptions) {
            //await fs.mkdirp(path.join(cwd, 'dist/packages', name));
            const compilerOptions = getTSConfigCompilerOptions_1.getTSConfigCompilerOptions({ cwd });
            if (buildTypescriptDeclaration) {
                sayTitle_1.sayTitle('BUILD TYPESCRIPT DECLARATIONS - ' + name);
                await buildTypescriptDeclarations_1.buildTypescriptDeclarations({
                    cwd,
                    file,
                    name,
                    compilerOptions,
                    typeRoots: [path_1.default.join(cwd, 'dist/packages')],
                    declarationDir: path_1.default.join(cwd, 'dist/packages', name),
                });
            }
            sayTitle_1.sayTitle('COPY PACKAGE FILES - ' + name);
            await fs_extra_1.default.copy(path_1.default.join(cwd, 'src/_packages', name), path_1.default.join(cwd, 'dist/packages', name), {
                filter: fsCopySourceFilter_1.fsCopySourceFilter,
            });
            const webpackConfig = webpack_merge_1.default(createWebpackBaseConfig_1.createWebpackBaseConfig({ zeroconfigPath }), {
                mode: 'production',
                entry: () => file,
                externals: [webpack_node_externals_1.default(), ...externals],
                output: {
                    path: path_1.default.join(cwd, 'dist/packages', name),
                    filename: 'index.js',
                    libraryTarget: 'commonjs',
                },
                optimization: {
                    concatenateModules: true,
                    minimize: false,
                },
                plugins: [
                    new mini_css_extract_plugin_1.default({
                        filename: 'index.css',
                    }),
                ],
            }, createWebpackPackageConfig_1.createWebpackPackageConfig({ cwd }));
            sayTitle_1.sayTitle('BUILD PACKAGE - ' + name);
            console.log(await runWebpack_1.runWebpack(webpackConfig));
        }
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD PACKAGES ERROR');
        console.error(error);
    }
}
exports.buildPackages = buildPackages;
//# sourceMappingURL=buildPackages.js.map