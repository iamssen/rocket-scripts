import { WebappArgv, WebappConfig } from '../types';
export declare function createWebappConfig({ argv, cwd, zeroconfigPath }: {
    argv: WebappArgv;
    cwd: string;
    zeroconfigPath: string;
}): Promise<WebappConfig>;
