import {
  CompilerOptions,
  findConfigFile,
  ParseConfigHost,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript';

const parseConfigHost: ParseConfigHost = {
  fileExists: sys.fileExists,
  readFile: sys.readFile,
  readDirectory: sys.readDirectory,
  useCaseSensitiveFileNames: true,
};

export function getTSConfigCompilerOptions({
  cwd,
  configName = 'tsconfig.json',
}: {
  cwd: string;
  configName?: string;
}): CompilerOptions {
  const configFileName: string | undefined = findConfigFile(cwd, sys.fileExists, configName);

  if (!configFileName) throw new Error(`Undefined "${configName}" file on "${cwd}"`);

  const { config, error } = readConfigFile(configFileName, sys.readFile);

  if (error) {
    throw error;
  } else if (!config) {
    throw new Error(`It was not generated config from readConfigFile("${configFileName}")`);
  }

  const { options } = parseJsonConfigFileContent(config, parseConfigHost, cwd);

  return options;
}
