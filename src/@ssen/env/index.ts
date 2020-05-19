import path from 'path';
import fs from 'fs';

export const mapEnv: (envFile: string) => (env: NodeJS.ProcessEnv) => NodeJS.ProcessEnv = (envFile) => (env) => {
  const file: string = path.join(process.cwd(), envFile);

  if (!fs.existsSync(file)) return env;

  return require(file)(env);
};

export const patchEnv: (origin?: NodeJS.ProcessEnv) => (env: NodeJS.ProcessEnv) => void = (origin = {}) => (env) => {
  Object.keys(env).forEach((key) => {
    if (env[key] && env[key] !== origin[key]) {
      process.env[key] = env[key];
    }
  });
};

export const printEnv: (...keys: string[]) => (env: NodeJS.ProcessEnv) => void = (...keys) => (env) => {
  const picked: NodeJS.ProcessEnv = Object.keys(env)
    .filter((key) => keys.indexOf(key) > -1)
    .reduce((picked, key) => {
      picked[key] = env[key];
      return picked;
    }, {});

  console.log(JSON.stringify(picked, null, 2));
};
