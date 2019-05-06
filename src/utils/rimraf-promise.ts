import _rimraf from 'rimraf';
import { promisify } from 'util';

export const rimraf: typeof _rimraf.__promisify__ = promisify(_rimraf);