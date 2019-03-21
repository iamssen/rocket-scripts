import { Config, ModuleBuildOption } from '../../types';
interface Params {
    buildOption: ModuleBuildOption;
    appDirectory: Config['appDirectory'];
    zeroconfigDirectory: Config['zeroconfigDirectory'];
}
declare const _default: ({ buildOption, appDirectory, zeroconfigDirectory }: Params) => Promise<void>;
export = _default;
