import { Config, ModuleBuildOption } from '../../types';
interface Params {
    buildOption: ModuleBuildOption;
    appDirectory: Config['appDirectory'];
}
declare const _default: ({ buildOption, appDirectory }: Params) => Promise<void>;
export = _default;
