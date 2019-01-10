import { Config, ModuleBuildOption } from './types';
interface Params {
    appDirectory: Config['appDirectory'];
    modules: {
        [name: string]: {
            group?: string;
        };
    };
}
declare const _default: ({ modules, appDirectory }: Params) => Promise<ModuleBuildOption[]>;
export = _default;
