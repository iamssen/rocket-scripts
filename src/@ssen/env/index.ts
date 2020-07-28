import { requireTypescript } from '@ssen/require-typescript';
import path from 'path';

export type TransformEnvFunction = (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv;

/**
 * ```
 * pipe(
 *   mapEnv('.env1'),
 *   mapEnv('.env2'),
 * )(process.env)
 * ```
 */
export const mapEnv: (envFile: string) => (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv = (envFile) => (
  env,
) => {
  try {
    return requireTypescript<{ default: TransformEnvFunction }>(
      path.isAbsolute(envFile) ? path.join(envFile) : path.join(process.cwd(), envFile),
    ).default(env);
  } catch {
    return env;
  }
};

export const patchEnv: (origin?: NodeJS.ProcessEnv) => (env: NodeJS.ProcessEnv) => void = (origin = {}) => (
  env,
) => {
  Object.keys(env).forEach((key) => {
    if (env[key] && env[key] !== origin[key]) {
      process.env[key] = env[key];
    }
  });
};

/**
 * ```
 * pickEnv('NODE_ENV', 'OUT_DIR')(process.env)
 * ```
 */
export const pickEnv: (...keys: string[]) => (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv = (...keys) => (
  env,
) => {
  return Object.keys(env)
    .filter((key) => keys.indexOf(key) > -1)
    .reduce((picked, key) => {
      picked[key] = env[key];
      return picked;
    }, {});
};
