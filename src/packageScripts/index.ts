import { say } from 'cfonts';
import fs from 'fs-extra';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { CompilerOptions } from 'typescript';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { buildTypescriptDeclarations } from '../runners/buildTypescriptDeclarations';
import { fsCopySourceFilter } from '../runners/fsCopySourceFilter';
import { runWebpack } from '../runners/runWebpack';
import { getBabelConfig } from '../transpile/getBabelConfig';
import { getTSConfigCompilerOptions } from '../transpile/getTSConfigCompilerOptions';
import { PackageBuildOption, PackagePublishOption } from '../types';
import { rimraf } from '../utils/rimraf-promise';
import { sayTitle } from '../utils/sayTitle';
import { createBaseWebpackConfig } from '../webpackConfigs/createBaseWebpackConfig';
import { getWebpackBasicLoaders } from '../webpackConfigs/getWebpackBasicLoaders';
import { getWebpackStyleLoaders } from '../webpackConfigs/getWebpackStyleLoaders';
import { createPackageBuildOptions } from './createPackageBuildOptions';
import { createPackagePublishOptions } from './createPackagePublishOptions';
import help from './help';
import { parsePackageArgv } from './parsePackageArgv';
import { publishPackage } from './publishPackage';
import { selectPublishOptions } from './selectPublishOptions';

const zeroconfigPath: string = path.join(__dirname, '../..');

export async function packageScripts(nodeArgv: string[], {cwd = process.cwd()}: {cwd?: string} = {}) {
  if (nodeArgv.indexOf('--help') > -1) {
    console.log(help);
    return;
  }
  
  const {command} = parsePackageArgv(nodeArgv);
  
  say('ZEROCONFIG', {font: 'block'});
  
  sayTitle('EXECUTED COMMAND');
  console.log('zeroconfig-package-scripts ' + nodeArgv.join(' '));
  
  if (command === 'build') {
    process.env.BROWSERSLIST_ENV = 'package';
    await build({cwd});
  } else if (command === 'publish') {
    await publish({cwd});
  } else {
    console.error('Unknown command :', command);
  }
}

async function publish({cwd}: {cwd: string}) {
  try {
    const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
    const publishOptions: PackagePublishOption[] = await createPackagePublishOptions({entry, cwd, version: 'latest'});
    
    sayTitle('SELECT PACKAGES TO PUBLISH');
    const selectedPublishOptions: PackagePublishOption[] = await selectPublishOptions({publishOptions});
    
    for await (const publishOption of selectedPublishOptions) {
      sayTitle('PUBLISH PACKAGE - ' + publishOption.name);
      await publishPackage({publishOption, cwd});
    }
  } catch (error) {
    sayTitle('⚠️ PUBLISH PACKAGES ERROR');
    console.error(error);
  }
}

async function build({cwd}: {cwd: string}) {
  try {
    await rimraf(path.join(cwd, 'dist/packages'));
    
    const extractCss: boolean = true;
    const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
    const buildOptions: PackageBuildOption[] = await createPackageBuildOptions({entry, cwd});
    const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({cwd});
    
    for await (const {name, file, externals, buildTypescriptDeclaration} of buildOptions) {
      //await fs.mkdirp(path.join(cwd, 'dist/packages', name));
      
      if (buildTypescriptDeclaration) {
        sayTitle('BUILD TYPESCRIPT DECLARATIONS - ' + name);
        await buildTypescriptDeclarations({
          cwd,
          file,
          name,
          compilerOptions,
          typeRoots: [path.join(cwd, 'dist/packages')],
          declarationDir: path.join(cwd, 'dist/packages', name),
        });
      }
      
      sayTitle('COPY PACKAGE FILES - ' + name);
      await fs.copy(
        path.join(cwd, 'src/_packages', name),
        path.join(cwd, 'dist/packages', name),
        {
          filter: fsCopySourceFilter,
        },
      );
      
      const webpackConfig: Configuration = webpackMerge(
        createBaseWebpackConfig({zeroconfigPath}),
        {
          mode: 'production',
          
          entry: () => file,
          
          externals: [nodeExternals(), ...externals],
          
          output: {
            path: path.join(cwd, 'dist/packages', name),
            filename: 'index.js',
            libraryTarget: 'commonjs',
          },
          
          optimization: {
            concatenateModules: true,
            minimize: false,
          },
          
          module: {
            rules: [
              {
                oneOf: [
                  // ts, tsx, js, jsx - script
                  // html, ejs, txt, md - plain text
                  ...getWebpackBasicLoaders({
                    include: path.join(cwd, 'src/_packages', name),
                    babelConfig: getBabelConfig({
                      cwd,
                      modules: false,
                    }),
                  }),
                  
                  // css, scss, sass, less - style
                  // module.* - css module
                  ...getWebpackStyleLoaders({
                    cssRegex: /\.css$/,
                    cssModuleRegex: /\.module.css$/,
                    extractCss,
                  }),
                  
                  ...getWebpackStyleLoaders({
                    cssRegex: /\.(scss|sass)$/,
                    cssModuleRegex: /\.module.(scss|sass)$/,
                    extractCss,
                    preProcessor: 'sass-loader',
                  }),
                  
                  ...getWebpackStyleLoaders({
                    cssRegex: /\.less$/,
                    cssModuleRegex: /\.module.less$/,
                    extractCss,
                    preProcessor: 'less-loader',
                  }),
                ],
              },
            ],
          },
          
          plugins: [
            new MiniCssExtractPlugin({
              filename: 'index.css',
            }),
          ],
        },
      );
      
      sayTitle('BUILD PACKAGE - ' + name);
      console.log(await runWebpack(webpackConfig));
    }
  } catch (error) {
    sayTitle('⚠️ BUILD PACKAGES ERROR');
    console.error(error);
  }
}