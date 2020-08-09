import { ElectronSwitchesYargsValues } from '@ssen/electron-switches';
import { Configuration as WebpackConfiguration } from 'webpack';

export interface StartParams {
  app: string;
  tsconfig?: string;
  mainWebpackConfig?: string | WebpackConfiguration;
  rendererWebpackConfig?: string | WebpackConfiguration;

  staticFileDirectories?: string[];
  stdout?: NodeJS.WriteStream;
  stdin?: NodeJS.ReadStream;
  outDir?: string;
  logfile?: string;
  electronSwitches?: ElectronSwitchesYargsValues;

  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export interface BuildParams {
  app: string;
  outDir?: string;
  tsconfig?: string;
  mainWebpackConfig?: string | WebpackConfiguration;
  rendererWebpackConfig?: string | WebpackConfiguration;
  staticFileDirectories?: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}
