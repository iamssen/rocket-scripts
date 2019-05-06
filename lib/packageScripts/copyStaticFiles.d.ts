import { PackageBuildOption } from '../types';
export declare function copyStaticFiles({ buildOption, cwd }: {
    buildOption: PackageBuildOption;
    cwd: string;
}): Promise<void>;
