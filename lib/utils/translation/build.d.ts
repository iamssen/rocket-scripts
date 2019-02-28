import { Config, TranslationType } from '../../types';
interface Params {
    appDirectory: Config['appDirectory'];
    outputPath: string;
    type: TranslationType;
    globPattern?: string;
}
declare const _default: ({ appDirectory, outputPath, type, globPattern }: Params) => Promise<void>;
export = _default;
