import { exec as _exec } from 'child_process';
import _glob from 'glob';
export declare const exec: typeof _exec.__promisify__;
export declare const glob: typeof _glob.__promisify__;
export declare const rimraf: (path: string) => Promise<void>;
