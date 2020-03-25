declare type Config = {
    [filename: string]: {
        maxSize?: number;
        maxGzipSize?: number;
        level?: 'error' | 'warning';
    };
};
export declare function test(config: Config, { cwd }: {
    cwd: string;
}): void;
export declare function testByConfig({ cwd }: {
    cwd: string;
}): void;
export {};
