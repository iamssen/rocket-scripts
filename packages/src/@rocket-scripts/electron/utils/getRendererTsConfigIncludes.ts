import path from 'path';

interface Params {
  cwd: string;
  app: string;
}

export function getRendererTsConfigIncludes({ cwd, app }: Params) {
  return [
    path.join(cwd, `src/${app}/renderer.ts*`),
    path.join(cwd, 'src/**/*.d.ts'),
  ];
}
