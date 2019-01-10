import { Config } from './types';
interface Params {
    filePath: string;
    appDirectory: Config['appDirectory'];
}
declare const _default: ({ filePath, appDirectory }: Params) => Promise<void>;
export = _default;
