import { getBrowserslistQuery } from '@react-zeroconfig/browserslist';
import { icuFormat } from '@react-zeroconfig/rule';
import {
  getWebpackMDXLoaders,
  getWebpackRawLoaders,
  getWebpackScriptLoaders,
  getWebpackStyleLoaders,
  getWebpackSVGLoaders,
  getWebpackYamlLoaders,
  runWebpack,
} from '@react-zeroconfig/webpack';
import { collectDependencies, getPackagesOrder } from '@ssen/collect-dependencies';
import { flatPackageName } from '@ssen/flat-package-name';
import { rimraf } from '@ssen/promised';
import { getTSConfigCompilerOptions } from '@ssen/tsconfig';
import fs from 'fs-extra';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { PackageJson } from 'type-fest';
import {
  CompilerOptions,
  createProgram,
  Diagnostic,
  EmitResult,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  ModuleKind,
  ModuleResolutionKind,
  Program,
  ScriptTarget,
} from 'typescript';
import { Configuration, Stats } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { getIndexFile } from './entry/getIndexFile';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { computePackageJson } from './package-json/computePackageJson';
import { getRootDependencies } from './package-json/getRootDependencies';
import { getSharedPackageJson } from './package-json/getSharedPackageJson';
import { collectPackageScripts, PackageInfo } from './rule';
import { fsPackagesCopyFilter } from './static-files/fsPackagesCopyFilter';

export interface BuildParams {
  cwd: string;
  outDir: string;
  tsconfig?: string;
  mode?: 'production' | 'development';
}

export async function build({ cwd, outDir: _outDir, tsconfig = 'tsconfig.json', mode = 'production' }: BuildParams) {
  const outDir: string = icuFormat(_outDir, { cwd, mode });

  // ---------------------------------------------
  // rule
  // collect information based on directory rules
  // ---------------------------------------------
  const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
  const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });
  const sharedConfig: PackageJson = await getSharedPackageJson({ cwd });

  // ---------------------------------------------
  // entry
  // create build options based on rule output
  // ---------------------------------------------
  const dependenciesMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const packageName of entry.keys()) {
    const imports: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(cwd, 'src', packageName),
      externalPackages,
      internalPackages: entry,
      ...collectPackageScripts,
    });

    dependenciesMap.set(packageName, imports);
  }

  const packageJsonMap: Map<string, PackageJson> = new Map<string, PackageJson>();

  for (const [packageName, packageInfo] of entry) {
    const dependencies: PackageJson.Dependency | undefined = dependenciesMap.get(packageName);

    if (!dependencies) {
      console.error(`undefiend dependencies of ${packageName}`);
      process.exit(1);
    }

    const packageJson: PackageJson = await computePackageJson({
      packageInfo,
      sharedConfig,
      packageDir: path.join(cwd, 'src', packageName),
      dependencies,
    });

    packageJsonMap.set(packageName, packageJson);
  }

  const order: string[] = getPackagesOrder({ packageJsonContents: Array.from(packageJsonMap.values()) });

  // ---------------------------------------------
  // run
  // build packages
  // ---------------------------------------------
  await rimraf(outDir);

  const targets: string | string[] = getBrowserslistQuery({ cwd, env: 'package' });
  const externals: string[] = [];

  if (!process.env.JEST_WORKER_ID) {
    console.log('');
    console.log('---------------------------------------------------------------------------------');
    console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
    console.log('---------------------------------------------------------------------------------');
  }

  for (const packageName of order) {
    const indexFile: string = await getIndexFile({ packageDir: path.join(cwd, 'src', packageName) });
    const sourceDir: string = path.dirname(indexFile);
    const outputDir: string = path.join(outDir, flatPackageName(packageName));

    // ---------------------------------------------
    // build typescript declaration
    // ---------------------------------------------
    const buildTypescriptDeclaration: boolean = /\.tsx?$/.test(indexFile);

    if (buildTypescriptDeclaration) {
      const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({
        cwd,
        configName: tsconfig,
      });

      const options: CompilerOptions = {
        ...compilerOptions,

        allowJs: false,
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ESNext,
        moduleResolution: ModuleResolutionKind.NodeJs,
        skipLibCheck: true,
        sourceMap: false,
        resolveJsonModule: true,

        typeRoots: [...(compilerOptions.typeRoots || []), path.join(cwd, 'node_modules/@types'), outDir],

        declaration: true,
        emitDeclarationOnly: true,

        baseUrl: sourceDir,
        declarationDir: outputDir,

        paths: {
          ...(fs.existsSync(outDir)
            ? {
                '*': [path.relative(sourceDir, path.join(outDir, '*'))],
              }
            : {}),
          [packageName]: [path.dirname(indexFile)],
        },
      };

      console.log(options);

      const program: Program = createProgram([indexFile], options);
      const emitResult: EmitResult = program.emit();
      const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

      for (const diagnostic of diagnostics) {
        if (diagnostic.file && diagnostic.start) {
          const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
          console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
      }

      if (emitResult.emitSkipped) {
        console.error(`Build the declaration files of "${packageName}" is failed`);
        process.exit(1);
      }
    } else {
      await fs.mkdirp(outputDir);
      await fs.writeFile(path.join(outputDir, 'index.d.ts'), `declare module '${packageName}';`);
    }

    // ---------------------------------------------
    // copy files
    // ---------------------------------------------
    await fs.copy(sourceDir, outputDir, { filter: fsPackagesCopyFilter });

    // ---------------------------------------------
    // webpack build
    // ---------------------------------------------
    const babelConfig: object = {
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

    const webpackConfig: Configuration = {
      mode,

      entry: () => indexFile,

      externals: [nodeExternals(), ...externals],

      output: {
        path: outputDir,
        filename: 'index.js',
        libraryTarget: 'commonjs',
      },

      resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
        alias: {
          // allow syntax `import 'PACKAGE-SELF-NAME'`
          [packageName]: sourceDir,
        },
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
              ...getWebpackScriptLoaders({
                include: sourceDir,
                useWebWorker: false,
                babelLoaderOptions: {
                  babelrc: false,
                  configFile: false,
                  ...babelConfig,
                },
              }),

              // svg - script
              ...getWebpackSVGLoaders({
                include: sourceDir,
                babelLoaderOptions: {
                  babelrc: false,
                  configFile: false,
                  ...babelConfig,
                },
              }),

              // mdx - script
              ...getWebpackMDXLoaders({
                include: sourceDir,
                babelLoaderOptions: {
                  babelrc: false,
                  configFile: false,
                  ...babelConfig,
                },
              }),

              // html, ejs, txt, md - plain text
              ...getWebpackRawLoaders(),

              // yaml, yml
              ...getWebpackYamlLoaders(),

              // css, scss, sass, less - style
              // module.* - css module
              ...getWebpackStyleLoaders({
                cssRegex: /\.css$/,
                cssModuleRegex: /\.module.css$/,
                extractCss: true,
              }),

              ...getWebpackStyleLoaders({
                cssRegex: /\.(scss|sass)$/,
                cssModuleRegex: /\.module.(scss|sass)$/,
                extractCss: true,
                preProcessor: 'sass-loader',
              }),

              ...getWebpackStyleLoaders({
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
        new MiniCssExtractPlugin({
          filename: 'style.css',
        }),
      ],

      // miscellaneous configs
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
      const stats: Stats = await runWebpack(webpackConfig);

      if (stats.hasErrors()) {
        console.error(
          stats.toString(
            typeof webpackConfig.stats === 'object'
              ? {
                  ...webpackConfig.stats,
                  colors: true,
                }
              : webpackConfig.stats,
          ),
        );
        process.exit(1);
      } else {
        console.log(
          stats.toString(
            typeof webpackConfig.stats === 'object'
              ? {
                  ...webpackConfig.stats,
                  colors: true,
                }
              : webpackConfig.stats,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    // ---------------------------------------------
    // create package.json
    // ---------------------------------------------
    await fs.writeJson(path.join(outputDir, 'package.json'), packageJsonMap.get(packageName));

    externals.push(packageName);
  }
}
