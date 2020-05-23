declare const defaultQuery: {
    readonly production: readonly ["chrome > 60", "firefox > 60", "safari > 12"];
    readonly development: readonly ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"];
    readonly server: "node 10";
    readonly server_development: "current node";
    readonly electron: "last 1 electron version";
    readonly package: readonly ["chrome > 60", "firefox > 60", "safari > 12"];
    readonly defaults: "current node";
};
interface Params {
    cwd: string;
    env?: keyof typeof defaultQuery;
}
export declare function getBrowserslistQuery({ cwd, env }: Params): string | string[];
export {};
