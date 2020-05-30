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
  getPreEmitDiagnostics,
  ModuleKind,
  ModuleResolutionKind,
  Program,
  ScriptTarget,
} from 'typescript';
import { Configuration, Stats } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { getBuildTransform } from './build/getBuildTransform';
import { getIndexFile } from './entry/getIndexFile';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { computePackageJson } from './package-json/computePackageJson';
import { getRootDependencies } from './package-json/getRootDependencies';
import { getSharedPackageJson } from './package-json/getSharedPackageJson';
import { collectPackageScripts, PackageInfo } from './rule';
import { fsPackagesCopyFilter } from './static-files/fsPackagesCopyFilter';

export type BuildMessage =
  | {
      type: 'browserslist';
      targets: string | string[];
    }
  | {
      type: 'begin';
      packageName: string;
      indexFile: string;
      sourceDir: string;
      outputDir: string;
    }
  | {
      type: 'success';
      packageName: string;
      indexFile: string;
      sourceDir: string;
      outputDir: string;
    }
  | {
      type: 'tsc';
      packageName: string;
      index: string;
      compilerOptions: CompilerOptions;
      diagnostics: Diagnostic[];
    }
  | {
      type: 'webpack';
      packageName: string;
      webpackConfig: Configuration;
      stats: Stats;
    }
  | {
      type: 'package-json';
      packageName: string;
      packageJson: PackageJson;
    }
  | {
      type: 'error';
      packageName?: string;
      error: Error;
    };

export interface BuildParams {
  cwd: string;
  outDir: string;
  tsconfig?: string;
  mode?: 'production' | 'development';
  onMessage: (message: BuildMessage) => void;
}

export async function build({
  cwd,
  outDir: _outDir,
  tsconfig = 'tsconfig.json',
  mode = 'production',
  onMessage,
}: BuildParams) {
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
      onMessage({
        type: 'error',
        packageName,
        error: new Error(`undefiend dependencies of ${packageName}`),
      });
      return;
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

  onMessage({
    type: 'browserslist',
    targets,
  });
  // if (!process.env.JEST_WORKER_ID) {
  //   console.log('');
  //   console.log('---------------------------------------------------------------------------------');
  //   console.log('= BABEL PRESET-ENV TARGETS (=BROWSERSLIST QUERY) : ', targets);
  //   console.log('---------------------------------------------------------------------------------');
  // }

  for (const packageName of order) {
    const indexFile: string = await getIndexFile({ packageDir: path.join(cwd, 'src', packageName) });
    const sourceDir: string = path.dirname(indexFile);
    const outputDir: string = path.join(outDir, flatPackageName(packageName));
    const {
      transformCompilerOptions = (compilerOptions: CompilerOptions) => compilerOptions,
      transformWebpackConfig = (webpackConfig: Configuration) => webpackConfig,
    } = await getBuildTransform({
      packageDir: path.join(cwd, 'src', packageName),
    });

    onMessage({
      type: 'begin',
      packageName,
      indexFile,
      sourceDir,
      outputDir,
    });

    // ---------------------------------------------
    // build typescript declaration
    // ---------------------------------------------
    const buildTypescriptDeclaration: boolean = /\.tsx?$/.test(indexFile);

    if (buildTypescriptDeclaration) {
      const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({
        cwd,
        configName: tsconfig,
      });

      const options: CompilerOptions = transformCompilerOptions({
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
      });

      const program: Program = createProgram([indexFile], options);
      const emitResult: EmitResult = program.emit();
      const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

      onMessage({
        type: 'tsc',
        packageName,
        index: indexFile,
        compilerOptions: options,
        diagnostics,
      });

      // for (const diagnostic of diagnostics) {
      //   if (diagnostic.file && diagnostic.start) {
      //     const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      //     const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      //     console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      //   } else {
      //     console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
      //   }
      // }

      if (emitResult.emitSkipped) {
        onMessage({
          type: 'error',
          error: new Error(`Build the declaration files of "${packageName}" is failed`),
        });
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

    const webpackConfig: Configuration = transformWebpackConfig({
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
    });

    try {
      const stats: Stats = await runWebpack(webpackConfig);

      onMessage({
        type: 'webpack',
        packageName,
        webpackConfig,
        stats,
      });

      if (stats.hasErrors()) {
        onMessage({
          type: 'error',
          packageName,
          error: new Error(stats.toJson().errors.join('\n')),
        });
      }
    } catch (error) {
      onMessage({
        type: 'error',
        packageName,
        error,
      });
    }

    // ---------------------------------------------
    // create package.json
    // ---------------------------------------------
    const packageJson: PackageJson | undefined = packageJsonMap.get(packageName);

    if (!packageJson) {
      onMessage({
        type: 'error',
        packageName,
        error: new Error(`undefiend package.json content of ${packageName}`),
      });
      return;
    }

    await fs.writeJson(path.join(outputDir, 'package.json'), packageJson);

    onMessage({
      type: 'package-json',
      packageName,
      packageJson,
    });

    externals.push(packageName);

    onMessage({
      type: 'success',
      packageName,
      indexFile,
      sourceDir,
      outputDir,
    });
  }
}
