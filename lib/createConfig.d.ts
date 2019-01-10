import { Config } from './types';
interface Params {
    command: Config['command'];
    appDirectory: Config['appDirectory'];
    ssenpackDirectory: Config['ssenpackDirectory'];
}
declare const _default: ({ command, appDirectory, ssenpackDirectory }: Params) => Config;
export = _default;
