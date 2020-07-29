import { render } from 'cfonts';

let version: string | null = null;

try {
  const packageJson = require('@rocket-scripts/web/package.json');
  version = packageJson?.version ?? null;
} catch {
  version = null;
}

export const rocketTitle: string =
  render('ROCKET', { font: 'block' }).string + (version ? `\n ${version}` : '');
