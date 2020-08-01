# `@rocket-scripts/web`

Web App Scripts

<img src="https://raw.githubusercontent.com/rocket-hangar/rocket-scripts/master/docs/screenshot.png" alt="Screenshot" style="max-width: 80%" />

# Usage

Start development:

```ts
import { start } from '@rocket-scripts/web';

(async () => {
  const cwd: string = process.cwd();

  await start({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });
})();
```

Build production:

```ts
import { build } from '@rocket-scripts/web';

(async () => {
  const cwd: string = process.cwd();

  await build({
    cwd,
    staticFileDirectories: ['{cwd}/public'],
    app: 'app',
  });
})();

```