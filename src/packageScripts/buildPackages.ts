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
import { getTSConfigCompilerOptions } from '../transpile/getTSConfigCompilerOptions';
import { PackageBuildOption } from '../types';
import { rimraf } from '../utils/rimraf-promise';
import { sayTitle } from '../utils/sayTitle';
import { createWebpackBaseConfig } from '../webpackConfigs/createWebpackBaseConfig';
import { createWebpackPackageConfig } from '../webpackConfigs/createWebpackPackageConfig';
import { createPackageBuildOptions } from './createPackageBuildOptions';
import { validatePackage } from './validatePackage';

const zeroconfigPath: string = path.join(__dirname, '../..');

export async function buildPackages({cwd}: {cwd: string}) {
  try {
    await rimraf(path.join(cwd, 'dist/packages'));
    
    const entry: string[] = await getInternalPackageEntry({packageDir: path.join(cwd, 'src/_packages')});
    const buildOptions: PackageBuildOption[] = await createPackageBuildOptions({entry, cwd});
    
    for await (const {name, file, externals, buildTypescriptDeclaration} of buildOptions) {
      //await fs.mkdirp(path.join(cwd, 'dist/packages', name));
      
      sayTitle('VALIDATE PACKAGE - ' + name);
      await validatePackage({
        name,
        packageDir: path.join(cwd, 'src/_packages', name),
      });
      
      if (buildTypescriptDeclaration) {
        const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({cwd});
        
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
        createWebpackBaseConfig({zeroconfigPath}),
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
          
          plugins: [
            new MiniCssExtractPlugin({
              filename: 'index.css',
            }),
          ],
        },
        createWebpackPackageConfig({cwd}),
      );
      
      sayTitle('BUILD PACKAGE - ' + name);
      console.log(await runWebpack(webpackConfig));
    }
  } catch (error) {
    sayTitle('⚠️ BUILD PACKAGES ERROR');
    console.error(error);
  }
}