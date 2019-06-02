import { WebappArgv } from '../types';
export declare function getStaticFileDirectories({ argv, cwd }: {
    argv: WebappArgv;
    cwd: string;
}): Promise<string[]>;
