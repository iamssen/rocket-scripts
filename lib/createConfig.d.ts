import { Config } from './types';
interface Params {
    command: Config['command'];
    appDirectory: Config['appDirectory'];
    zeroconfigDirectory: Config['zeroconfigDirectory'];
}
declare const _default: ({ command, appDirectory, zeroconfigDirectory }: Params) => Config;
export = _default;
