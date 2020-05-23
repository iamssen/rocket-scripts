interface Params {
    appDir: string;
}
export interface AppEntry {
    name: string;
    html: string;
    index: string;
}
export declare function getAppEntry({ appDir }: Params): Promise<AppEntry[]>;
export {};
