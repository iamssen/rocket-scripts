import { exec as _exec } from 'child_process';
import _glob from 'glob';
import _rimraf from 'rimraf';
import { promisify } from 'util';

export const exec: typeof _exec.__promisify__ = promisify(_exec);
export const glob: typeof _glob.__promisify__ = promisify(_glob);
export const rimraf: (path: string) => Promise<void> = promisify(_rimraf);
