import _glob from 'glob';
import { promisify } from 'util';

export const glob: typeof _glob.__promisify__ = promisify(_glob);