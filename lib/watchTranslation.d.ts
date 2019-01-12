import { Subscribable } from 'rxjs';
import { Config, TranslationType } from './types';
interface Params {
    appDirectory: Config['appDirectory'];
    outputPath: string;
    type: TranslationType;
}
declare const _default: ({ appDirectory, outputPath, type }: Params) => Subscribable<void>;
export = _default;
