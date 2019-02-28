import { Config, TranslationType } from '../../types';
interface Params {
    filePath: string;
    appDirectory: Config['appDirectory'];
    type: TranslationType;
}
declare const _default: ({ filePath, appDirectory, type }: Params) => Promise<void>;
export = _default;
