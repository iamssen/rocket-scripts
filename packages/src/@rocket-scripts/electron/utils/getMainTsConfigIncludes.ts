import path from 'path';

interface Params {
  cwd: string;
  app: string;
}

export function getMainTsConfigIncludes({ cwd, app }: Params) {
  return [
    path.join(cwd, `src/${app}/main.ts*`),
    path.join(cwd, `src/${app}/preload.ts*`),
    path.join(cwd, 'src/**/*.d.ts'),
  ];
}
