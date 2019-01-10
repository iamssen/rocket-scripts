import { Config } from './types';
interface Params {
    file: string;
    appDirectory: Config['appDirectory'];
}
declare const _default: ({ file, appDirectory }: Params) => Promise<void>;
export = _default;
