import { Config, ModuleBuildOption } from './types';
interface Params {
    appDirectory: Config['appDirectory'];
    modules: Config['modules']['entry'];
}
declare const _default: ({ modules, appDirectory }: Params) => Promise<ModuleBuildOption[]>;
export = _default;
