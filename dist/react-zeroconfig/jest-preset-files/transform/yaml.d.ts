/// <reference types="node" />
import { BinaryLike } from 'crypto';
declare function getCacheKey(fileData: BinaryLike, filePath: string, configString: string): string;
declare function process(sourceText: string): string;
declare const _default: {
    getCacheKey: typeof getCacheKey;
    process: typeof process;
};
export = _default;
