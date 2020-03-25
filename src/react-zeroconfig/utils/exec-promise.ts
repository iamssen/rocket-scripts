import { exec as _exec } from 'child_process';
import { promisify } from 'util';

export const exec: typeof _exec.__promisify__ = promisify(_exec);
