import { TranslationStore, TranslationType } from './types';
interface Params {
    translationStore: TranslationStore;
    outputPath: string;
    type: TranslationType;
}
declare const _default: ({ translationStore, outputPath, type }: Params) => Promise<void>;
export = _default;
