import { say } from 'cfonts';
import fs from 'fs-extra';
import path from 'path';
import { CompilerOptions } from 'typescript';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { createPackageBuildOptions } from '../configuration/createPackageBuildOptions';
import { createPackagePublishOptions } from '../configuration/createPackagePublishOptions';
import { parsePackageArgv } from '../configuration/parsePackageArgv';
import { getInternalPackageEntry } from '../internalPackage/getInternalPackageEntry';
import { runWebpack } from '../runners/runWebpack';
import { getTSConfigCompilerOptions } from '../transpile/getTSConfigCompilerOptions';
import { PackageBuildOption, PackagePublishOption } from '../types';
import { rimraf } from '../utils/rimraf-promise';
import { sayTitle } from '../utils/sayTitle';
import { createBaseWebpackConfig } from '../webpackConfigs/createBaseWebpackConfig';
import { createPackageWebpackConfig } from '../webpackConfigs/createPackageWebpackConfig';
import { buildTypescriptDeclarations } from './buildTypescriptDeclarations';
import { copyStaticFiles } from './copyStaticFiles';
import { publishPackage } from './publishPackage';
import { selectPublishOptions } from './selectPublishOptions';
import help from './help';

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
    await build({cwd});
  } else if (command === 'publish') {
    await publish({cwd});
  } else {
    console.error('Unknown command :', command);
  }
}

async function publish({cwd}: {cwd: string}) {
  try {
    const entry: string[] = await getInternalPackageEntry({cwd});
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
    
    const entry: string[] = await getInternalPackageEntry({cwd});
    const buildOptions: PackageBuildOption[] = await createPackageBuildOptions({entry, cwd});
    const compilerOptions: CompilerOptions = getTSConfigCompilerOptions({cwd});
    
    for await (const buildOption of buildOptions) {
      await fs.mkdirp(path.join(cwd, 'dist/packages', buildOption.name));
      
      if (buildOption.buildTypescriptDeclaration) {
        sayTitle('BUILD TYPESCRIPT DECLARATIONS - ' + buildOption.name);
        console.log(compilerOptions);
        await buildTypescriptDeclarations({cwd, buildOption, compilerOptions});
      }
      
      sayTitle('COPY PACKAGE FILES - ' + buildOption.name);
      await copyStaticFiles({cwd, buildOption});
      
      const webpackConfig: Configuration = webpackMerge(
        createBaseWebpackConfig({zeroconfigPath}),
        {
          mode: 'production',
        },
        createPackageWebpackConfig({
          cwd,
          name: buildOption.name,
          file: buildOption.file,
          externals: buildOption.externals,
        }),
      );
      
      sayTitle('BUILD PACKAGE - ' + buildOption.name);
      console.log(await runWebpack(webpackConfig));
    }
  } catch (error) {
    sayTitle('⚠️ BUILD PACKAGES ERROR');
    console.error(error);
  }
}