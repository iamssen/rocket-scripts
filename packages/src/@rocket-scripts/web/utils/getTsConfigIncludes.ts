import path from 'path';
import { AppEntry } from './getAppEntry';

interface Params {
  cwd: string;
  app: string;
  entry: AppEntry[];
  isolatedScripts?: Record<string, string>;
}

export function getTsConfigIncludes({
  cwd,
  app,
  entry,
  isolatedScripts,
}: Params) {
  const tsConfigIncludes: string[] = [
    ...entry.map(({ index }) => path.join(cwd, 'src', app, index)),
    path.join(cwd, 'src/**/*.d.ts'),
  ];

  if (isolatedScripts) {
    tsConfigIncludes.push(
      ...Object.keys(isolatedScripts).map((file) =>
        path.join(cwd, 'src', app, isolatedScripts[file]),
      ),
    );
  }

  return tsConfigIncludes;
}
