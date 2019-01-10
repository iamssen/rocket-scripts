import { Config } from './types';
interface Params {
    staticFileDirectories: Config['app']['staticFileDirectories'];
    outputPath: string;
}
declare const _default: ({ staticFileDirectories, outputPath }: Params) => Promise<void[]>;
export = _default;
