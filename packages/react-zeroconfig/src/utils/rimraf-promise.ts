import _rimraf from 'rimraf';
import { promisify } from 'util';

export const rimraf: (path: string) => Promise<void> = promisify(_rimraf);