import fs from 'fs-extra';
import path from 'path';

interface Params {
  cwd?: string;
  dest?: string;
}

export async function copyFixture(
  dir: string,
  {
    cwd = process.cwd(),
    dest = path.join(process.cwd(), '.fixtures'),
  }: Params = {},
): Promise<string> {
  const origin: string = path.join(cwd, dir);
  const fixture: string = path.join(dest, dir + '-' + Date.now());

  await fs.mkdirp(fixture);
  await fs.copy(origin, fixture);

  return fixture;
}
