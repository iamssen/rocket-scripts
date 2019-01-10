import { Config } from './types';
interface Params {
    appDirectory: Config['appDirectory'];
    outputPath: string;
}
declare const _default: ({ appDirectory, outputPath }: Params) => Promise<void>;
export = _default;
