"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfonts_1 = require("cfonts");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const runWebpack_1 = require("../runners/runWebpack");
const getTSConfigCompilerOptions_1 = require("../transpile/getTSConfigCompilerOptions");
const rimraf_promise_1 = require("../utils/rimraf-promise");
const sayTitle_1 = require("../utils/sayTitle");
const createBaseWebpackConfig_1 = require("../webpackConfigs/createBaseWebpackConfig");
const createPackageWebpackConfig_1 = require("../webpackConfigs/createPackageWebpackConfig");
const buildTypescriptDeclarations_1 = require("../runners/buildTypescriptDeclarations");
const createPackageBuildOptions_1 = require("./createPackageBuildOptions");
const createPackagePublishOptions_1 = require("./createPackagePublishOptions");
const fsCopySourceFilter_1 = require("../utils/fsCopySourceFilter");
const help_1 = __importDefault(require("./help"));
const parsePackageArgv_1 = require("./parsePackageArgv");
const publishPackage_1 = require("./publishPackage");
const selectPublishOptions_1 = require("./selectPublishOptions");
const zeroconfigPath = path_1.default.join(__dirname, '../..');
async function packageScripts(nodeArgv, { cwd = process.cwd() } = {}) {
    if (nodeArgv.indexOf('--help') > -1) {
        console.log(help_1.default);
        return;
    }
    const { command } = parsePackageArgv_1.parsePackageArgv(nodeArgv);
    cfonts_1.say('ZEROCONFIG', { font: 'block' });
    sayTitle_1.sayTitle('EXECUTED COMMAND');
    console.log('zeroconfig-package-scripts ' + nodeArgv.join(' '));
    if (command === 'build') {
        await build({ cwd });
    }
    else if (command === 'publish') {
        await publish({ cwd });
    }
    else {
        console.error('Unknown command :', command);
    }
}
exports.packageScripts = packageScripts;
async function publish({ cwd }) {
    try {
        const entry = await getInternalPackageEntry_1.getInternalPackageEntry({ cwd });
        const publishOptions = await createPackagePublishOptions_1.createPackagePublishOptions({ entry, cwd, version: 'latest' });
        sayTitle_1.sayTitle('SELECT PACKAGES TO PUBLISH');
        const selectedPublishOptions = await selectPublishOptions_1.selectPublishOptions({ publishOptions });
        for await (const publishOption of selectedPublishOptions) {
            sayTitle_1.sayTitle('PUBLISH PACKAGE - ' + publishOption.name);
            await publishPackage_1.publishPackage({ publishOption, cwd });
        }
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ PUBLISH PACKAGES ERROR');
        console.error(error);
    }
}
async function build({ cwd }) {
    try {
        await rimraf_promise_1.rimraf(path_1.default.join(cwd, 'dist/packages'));
        const entry = await getInternalPackageEntry_1.getInternalPackageEntry({ cwd });
        const buildOptions = await createPackageBuildOptions_1.createPackageBuildOptions({ entry, cwd });
        const compilerOptions = getTSConfigCompilerOptions_1.getTSConfigCompilerOptions({ cwd });
        for await (const { name, file, externals, buildTypescriptDeclaration } of buildOptions) {
            await fs_extra_1.default.mkdirp(path_1.default.join(cwd, 'dist/packages', name));
            if (buildTypescriptDeclaration) {
                sayTitle_1.sayTitle('BUILD TYPESCRIPT DECLARATIONS - ' + name);
                console.log(compilerOptions);
                await buildTypescriptDeclarations_1.buildTypescriptDeclarations({
                    cwd,
                    indexFile: file,
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
            const webpackConfig = webpack_merge_1.default(createBaseWebpackConfig_1.createBaseWebpackConfig({ zeroconfigPath }), {
                mode: 'production',
            }, createPackageWebpackConfig_1.createPackageWebpackConfig({
                cwd,
                name,
                file,
                externals,
            }));
            sayTitle_1.sayTitle('BUILD PACKAGE - ' + name);
            console.log(await runWebpack_1.runWebpack(webpackConfig));
        }
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD PACKAGES ERROR');
        console.error(error);
    }
}
//# sourceMappingURL=index.js.map