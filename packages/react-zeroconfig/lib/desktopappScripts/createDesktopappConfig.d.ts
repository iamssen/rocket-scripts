import { DesktopappArgv, DesktopappConfig } from '../types';
export declare function createDesktopappConfig({ argv, cwd, zeroconfigPath, }: {
    argv: DesktopappArgv;
    cwd: string;
    zeroconfigPath: string;
}): Promise<DesktopappConfig>;
