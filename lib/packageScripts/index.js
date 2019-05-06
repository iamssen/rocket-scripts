"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cfonts_1 = require("cfonts");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const createPackageBuildOptions_1 = require("../configuration/createPackageBuildOptions");
const createPackagePublishOptions_1 = require("../configuration/createPackagePublishOptions");
const parsePackageArgv_1 = require("../configuration/parsePackageArgv");
const getInternalPackageEntry_1 = require("../internalPackage/getInternalPackageEntry");
const runWebpack_1 = require("../runners/runWebpack");
const getTSConfigCompilerOptions_1 = require("../transpile/getTSConfigCompilerOptions");
const rimraf_promise_1 = require("../utils/rimraf-promise");
const sayTitle_1 = require("../utils/sayTitle");
const createBaseWebpackConfig_1 = require("../webpackConfigs/createBaseWebpackConfig");
const createPackageWebpackConfig_1 = require("../webpackConfigs/createPackageWebpackConfig");
const buildTypescriptDeclarations_1 = require("./buildTypescriptDeclarations");
const copyStaticFiles_1 = require("./copyStaticFiles");
const publishPackage_1 = require("./publishPackage");
const selectPublishOptions_1 = require("./selectPublishOptions");
const help_1 = __importDefault(require("./help"));
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
        for await (const buildOption of buildOptions) {
            await fs_extra_1.default.mkdirp(path_1.default.join(cwd, 'dist/packages', buildOption.name));
            if (buildOption.buildTypescriptDeclaration) {
                sayTitle_1.sayTitle('BUILD TYPESCRIPT DECLARATIONS - ' + buildOption.name);
                console.log(compilerOptions);
                await buildTypescriptDeclarations_1.buildTypescriptDeclarations({ cwd, buildOption, compilerOptions });
            }
            sayTitle_1.sayTitle('COPY PACKAGE FILES - ' + buildOption.name);
            await copyStaticFiles_1.copyStaticFiles({ cwd, buildOption });
            const webpackConfig = webpack_merge_1.default(createBaseWebpackConfig_1.createBaseWebpackConfig({ zeroconfigPath }), {
                mode: 'production',
            }, createPackageWebpackConfig_1.createPackageWebpackConfig({
                cwd,
                name: buildOption.name,
                file: buildOption.file,
                externals: buildOption.externals,
            }));
            sayTitle_1.sayTitle('BUILD PACKAGE - ' + buildOption.name);
            console.log(await runWebpack_1.runWebpack(webpackConfig));
        }
    }
    catch (error) {
        sayTitle_1.sayTitle('⚠️ BUILD PACKAGES ERROR');
        console.error(error);
    }
}
//# sourceMappingURL=index.js.map