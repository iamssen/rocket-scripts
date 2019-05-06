/// <reference types="node" />
import { PackagePublishOption } from '../types';
export declare function publishPackage({ publishOption, cwd, exec }: {
    publishOption: PackagePublishOption;
    cwd: string;
    exec?: (command: string) => Buffer | string;
}): string;
