"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const core_1 = require("@react-zeroconfig/core");
const webpack_1 = require("@react-zeroconfig/webpack");
const collect_dependencies_1 = require("@ssen/collect-dependencies");
const promised_1 = require("@ssen/promised");
const tsconfig_1 = require("@ssen/tsconfig");
const fs_extra_1 = __importDefault(require("fs-extra"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const typescript_1 = require("typescript");
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const getIndexFile_1 = require("./build/getIndexFile");
const computePackageJson_1 = require("./entry/computePackageJson");
const flatPackageName_1 = require("./rule/flatPackageName");
const fsCopyFilter_1 = require("./rule/fsCopyFilter");
const getPackagesEntry_1 = require("./rule/getPackagesEntry");
const getSharedConfig_1 = require("./rule/getSharedConfig");
async function build({ cwd, outDir, tsconfig = 'tsconfig.json', mode = 'production' }) {
    // ---------------------------------------------
    // rule
    // collect information based on directory rules
    // ---------------------------------------------
    const entry = await getPackagesEntry_1.getPackagesEntry({ cwd });
    const externalPackages = await core_1.getDependencies({ cwd });
    const sharedConfig = await getSharedConfig_1.getSharedConfig({ cwd });
    // ---------------------------------------------
    // entry
    // create build options based on rule output
    // ---------------------------------------------
    const dependenciesMap = new Map();
    for (const packageName of entry.keys()) {
        const imports = await collect_dependencies_1.collectDependencies({
            rootDir: path_1.default.join(cwd, 'src', packageName),
            externalPackages,
            internalPackages: entry,
            ...core_1.collectPackageScripts,
        });
        dependenciesMap.set(packageName, imports);
    }
    const packageJsonMap = new Map();
    for (const [packageName, packageInfo] of entry) {
        const dependencies = dependenciesMap.get(packageName);
        if (!dependencies) {
            console.error(`undefiend dependencies of ${packageName}`);
            process.exit(1);
        }
        const packageJson = await computePackageJson_1.computePackageJson({
            packageInfo,
            sharedConfig,
            packageDir: path_1.default.join(cwd, 'src', packageName),
            dependencies,
        });
        packageJsonMap.set(packageName, packageJson);
    }
    const order = collect_dependencies_1.getPackagesOrder({ packageJsonContents: Array.from(packageJsonMap.values()) });
    // ---------------------------------------------
    // run
    // build packages
    // ---------------------------------------------
    await promised_1.rimraf(outDir);
    const targets = core_1.getBrowserslistQuery({ cwd, env: 'package' });
    const externals = [];
    if (!process.env.JEST_WORKER_ID) {
        console.log('');
        console.log('---------------------------------------------------------------------------------');
        console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
        console.log('---------------------------------------------------------------------------------');
    }
    for (const packageName of order) {
        const indexFile = await getIndexFile_1.getIndexFile({ packageDir: path_1.default.join(cwd, 'src', packageName) });
        const sourceDir = path_1.default.dirname(indexFile);
        const outputDir = path_1.default.join(outDir, flatPackageName_1.flatPackageName(packageName));
        // ---------------------------------------------
        // build typescript declaration
        // ---------------------------------------------
        const buildTypescriptDeclaration = /\.tsx?$/.test(indexFile);
        if (buildTypescriptDeclaration) {
            const compilerOptions = tsconfig_1.getTSConfigCompilerOptions({
                cwd,
                configName: tsconfig,
            });
            const options = {
                ...compilerOptions,
                allowJs: false,
                module: typescript_1.ModuleKind.CommonJS,
                target: typescript_1.ScriptTarget.ESNext,
                moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
                skipLibCheck: true,
                sourceMap: false,
                resolveJsonModule: true,
                typeRoots: [...(compilerOptions.typeRoots || []), path_1.default.join(cwd, 'node_modules/@types'), outDir],
                declaration: true,
                emitDeclarationOnly: true,
                baseUrl: sourceDir,
                declarationDir: outputDir,
                paths: {
                    ...(fs_extra_1.default.existsSync(outDir)
                        ? {
                            '*': [path_1.default.relative(sourceDir, path_1.default.join(outDir, '*'))],
                        }
                        : {}),
                    [packageName]: [path_1.default.dirname(indexFile)],
                },
            };
            console.log(options);
            const program = typescript_1.createProgram([indexFile], options);
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
                console.error(`Build the declaration files of "${packageName}" is failed`);
                process.exit(1);
            }
        }
        else {
            await fs_extra_1.default.mkdirp(outputDir);
            await fs_extra_1.default.writeFile(path_1.default.join(outputDir, 'index.d.ts'), `declare module '${packageName}';`);
        }
        // ---------------------------------------------
        // copy files
        // ---------------------------------------------
        await fs_extra_1.default.copy(sourceDir, outputDir, { filter: fsCopyFilter_1.fsCopyFilter });
        // ---------------------------------------------
        // webpack build
        // ---------------------------------------------
        const babelConfig = {
            presets: [
                [
                    require.resolve('@react-zeroconfig/babel-preset'),
                    {
                        modules: false,
                        targets,
                    },
                ],
            ],
            plugins: [require.resolve('@handbook/babel-plugin')],
        };
        const webpackConfig = {
            mode,
            entry: () => indexFile,
            resolve: {
                extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
                alias: {
                    // allow syntax `import 'PACKAGE-SELF-NAME'`
                    [packageName]: sourceDir,
                },
            },
            externals: [webpack_node_externals_1.default(), ...externals],
            output: {
                path: outputDir,
                filename: 'index.js',
                libraryTarget: 'commonjs',
            },
            optimization: {
                concatenateModules: true,
                minimize: false,
            },
            module: {
                strictExportPresence: true,
                rules: [
                    {
                        oneOf: [
                            // ts, tsx, js, tsx - script
                            ...webpack_1.getWebpackScriptLoaders({
                                include: sourceDir,
                                useWebWorker: false,
                                babelLoaderOptions: {
                                    babelrc: false,
                                    configFile: false,
                                    ...babelConfig,
                                },
                            }),
                            // svg - script
                            ...webpack_1.getWebpackSVGLoaders({
                                include: sourceDir,
                                babelLoaderOptions: {
                                    babelrc: false,
                                    configFile: false,
                                    ...babelConfig,
                                },
                            }),
                            // mdx - script
                            ...webpack_1.getWebpackMDXLoaders({
                                include: sourceDir,
                                babelLoaderOptions: {
                                    babelrc: false,
                                    configFile: false,
                                    ...babelConfig,
                                },
                            }),
                            // html, ejs, txt, md - plain text
                            ...webpack_1.getWebpackRawLoaders(),
                            // yaml, yml
                            ...webpack_1.getWebpackYamlLoaders(),
                            // css, scss, sass, less - style
                            // module.* - css module
                            ...webpack_1.getWebpackStyleLoaders({
                                cssRegex: /\.css$/,
                                cssModuleRegex: /\.module.css$/,
                                extractCss: true,
                            }),
                            ...webpack_1.getWebpackStyleLoaders({
                                cssRegex: /\.(scss|sass)$/,
                                cssModuleRegex: /\.module.(scss|sass)$/,
                                extractCss: true,
                                preProcessor: 'sass-loader',
                            }),
                            ...webpack_1.getWebpackStyleLoaders({
                                cssRegex: /\.less$/,
                                cssModuleRegex: /\.module.less$/,
                                extractCss: true,
                                preProcessor: 'less-loader',
                            }),
                            // every files import by data uri
                            {
                                loader: require.resolve('url-loader'),
                                exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
                                options: {
                                    name: `[name].[hash].[ext]`,
                                },
                            },
                        ],
                    },
                ],
            },
            plugins: [
                new mini_css_extract_plugin_1.default({
                    filename: 'style.css',
                }),
            ],
            resolveLoader: {
                modules: ['node_modules'],
            },
            performance: {
                hints: 'warning',
                maxEntrypointSize: 30000000,
                maxAssetSize: 20000000,
            },
            stats: {
                modules: false,
                maxModules: 0,
                errors: true,
                warnings: true,
                children: false,
                moduleTrace: true,
                errorDetails: true,
            },
        };
        try {
            const stats = await webpack_1.runWebpack(webpackConfig);
            if (stats.hasErrors()) {
                console.error(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
                process.exit(1);
            }
            else {
                console.log(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        ...webpackConfig.stats,
                        colors: true,
                    }
                    : webpackConfig.stats));
            }
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
        // ---------------------------------------------
        // create package.json
        // ---------------------------------------------
        await fs_extra_1.default.writeJson(path_1.default.join(outputDir, 'package.json'), packageJsonMap.get(packageName));
        externals.push(packageName);
    }
}
exports.build = build;
//# sourceMappingURL=build.js.map