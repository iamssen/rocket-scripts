import { PackagePublishOption } from '../types';
export declare function getVersions({ currentPackageJson, remotePackageJson, }: PackagePublishOption): {
    currentVersion: string;
    remoteVersion: string | undefined;
};
export declare function selectPublishOptions({ publishOptions, choice, }: {
    publishOptions: PackagePublishOption[];
    choice: boolean;
}): Promise<PackagePublishOption[]>;
