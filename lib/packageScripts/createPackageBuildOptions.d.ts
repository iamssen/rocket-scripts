import { PackageBuildOption } from '../types';
export declare function createPackageBuildOptions({ entry, cwd }: {
    entry: string[];
    cwd: string;
}): Promise<PackageBuildOption[]>;
