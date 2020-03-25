import { ExtensionArgv, ExtensionConfig } from '../types';
export declare function createExtensionConfig({ argv, cwd, zeroconfigPath, }: {
    argv: ExtensionArgv;
    cwd: string;
    zeroconfigPath: string;
}): Promise<ExtensionConfig>;
