import { Config, ModulePublishOption } from '../../types';
interface Params {
    publishOptions: ModulePublishOption[];
    appDirectory: Config['appDirectory'];
    exec?: (command: string) => string;
}
declare const _default: ({ publishOptions, appDirectory, exec }: Params) => Promise<void>;
export = _default;
