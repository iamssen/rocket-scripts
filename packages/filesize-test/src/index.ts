import fs, { Stats } from 'fs';
import path from 'path';
import glob from 'glob';
import gzipSize from 'gzip-size';

type Config = {
  [filename: string]: {
    maxSize?: number;
    maxGzipSize?: number;
    level?: 'error' | 'warning';
  };
};

function log(message: string, level: 'error' | 'warning') {
  if (level === 'error') {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

export function test(config: Config, { cwd = process.cwd() }: { cwd: string }) {
  Object.keys(config).forEach((filename) => {
    const { level = 'error', maxGzipSize, maxSize } = config[filename];

    const files: string[] = glob.sync(filename, { cwd });

    for (const file of files) {
      if (typeof maxSize === 'number') {
        const stat: Stats = fs.statSync(path.join(cwd, file));
        if (stat.size > maxSize) {
          log(`the file size of "${file}" is ${stat.size}. it is higher than ${maxSize}`, level);
        }
      } else if (typeof maxGzipSize === 'number') {
        const size: number = gzipSize.fileSync(path.join(cwd, file));
        if (size > maxGzipSize) {
          log(`the gzip size of "${file}" is ${size}. it is higher than ${maxGzipSize}`, level);
        }
      }
    }
  });
}

export function testByConfig({ cwd = process.cwd() }: { cwd: string }) {
  const configFile: string = path.join(cwd, 'filesize-test.json');

  if (!fs.existsSync(configFile)) {
    throw new Error(`Undefined ${configFile}`);
  }

  const config: Config = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }));

  test(config, { cwd });
}
