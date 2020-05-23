import { PublishOption } from './types';
export declare function getVersions({ current, remote, }: PublishOption): {
    currentVersion: string;
    remoteVersion: string | undefined;
};
interface Params {
    publishOptions: Map<string, PublishOption>;
    force: boolean;
}
export declare function selectPublishOptions({ publishOptions, force }: Params): Promise<PublishOption[]>;
export {};
