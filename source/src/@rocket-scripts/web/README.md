# 🚀 Rocket Scripts

[![NPM](https://img.shields.io/npm/v/@rocket-scripts/web.svg)](https://www.npmjs.com/package/@rocket-scripts/web)
[![NPM](https://img.shields.io/npm/v/@rocket-scripts/electron.svg)](https://www.npmjs.com/package/@rocket-scripts/electron)
[![TEST](https://github.com/rocket-hangar/rocket-scripts/workflows/TEST/badge.svg)](https://github.com/rocket-hangar/rocket-scripts/actions?query=workflow%3ATEST)
[![E2E](https://github.com/rocket-hangar/rocket-scripts/workflows/E2E/badge.svg)](https://github.com/rocket-hangar/rocket-scripts/actions?query=workflow%3AE2E)
[![codecov](https://codecov.io/gh/rocket-hangar/rocket-scripts/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/rocket-scripts)

🚀 Rocket Scripts are development scripts for React web apps and React electron apps.

These scripts are not support CLI for easy usage.

But, you can easy combine the many other environments (e.g. Back-End API Server, Puppeteer...) in API usage.

For example, you can available like below.

<https://github.com/rocket-hangar/rocket-scripts-templates/blob/master/examples/web-with-backend/scripts/start.ts>

```ts
// 1. Start Back-End API Server
// 2. Start Front-End Development Server
// 3. Start Chromium Browser with Puppeteer
import { serverStart } from '@myorg/api-server';
import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);
  const serverPort: number = +(process.env.API_SERVER_PORT ?? 9455);
  
  // start back-end server
  await serverStart({ port: serverPort });
  
  // start front-end dev server
  const { port } = await start({
    app: 'client',
    webpackDevServerConfig: {
      // bind proxy `<back-end>/*` -> `<front-end>/api/*`
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
  });
  
  // start puppeteer
  const browser = await puppeteer.launch({
    //userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: [
      '--start-fullscreen',
      `--remote-debugging-port=${remoteDebuggingPort}`,
    ],
    devtools: true,
  });
  
  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);
  
  await page.waitForFunction(`document.querySelector('#app h1').innerHTML === 'Hello World!'`, {
    timeout: 1000 * 60,
    polling: 1000 * 3,
  });
})();
```

<https://github.com/rocket-hangar/rocket-scripts-templates/blob/master/examples/repeat-profiling/scripts/start.tsx>

```tsx
// 1. Start Front-End development server
// 2. Start Chromium Broser with Puppeteer
// 3. Start performance profiling with shortcut on Interactive CLI
import { start } from '@rocket-scripts/web';
import { Divider } from '@ssen/dev-server-components';
import chokidar from 'chokidar';
import { format } from 'date-fns';
import { FSWatcher } from 'fs';
import fs from 'fs-extra';
import { Text, useInput } from 'ink';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';
import React, { useCallback, useEffect, useState } from 'react';

const profileStore: string = path.join(process.cwd(), 'profiles');

function ProfileRepeater({
  browser,
  pageUrl,
  shortcuts,
}: {
  browser: Browser;
  pageUrl: string;
  shortcuts: {
    record: string;
    clean: string;
  };
}) {
  const [profiles, setProfiles] = useState<string[]>([]);

  const run = useCallback(async () => {
    const page = await browser.newPage();

    const profile: string = path.join(
      profileStore,
      `animate-${format(new Date(), 'yyyy-MM-dd-hhmmss')}.json`,
    );

    await page.tracing.start({
      path: profile,
      screenshots: true,
      // @see ~/tracing.categories.json
      // const cdp: CDPSession = await page._client;
      // const categories = await cdp.send('Tracing.getCategories');
      categories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'disabled-by-default-devtools.timeline.stack',
        'disabled-by-default-v8.cpu_profiler',
        'disabled-by-default-v8.cpu_profiler.hires',
        'memory',
      ],
    });

    await page.goto(pageUrl);

    await page.waitFor(4000);

    await page.tracing.stop();

    await page.close();
  }, [browser, pageUrl]);

  useEffect(() => {
    function update() {
      setProfiles(fs.readdirSync(profileStore).filter((file) => /^animate-/.test(file)));
    }

    const watcher: FSWatcher = chokidar
      .watch([`${profileStore}/*.json`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      watcher.close();
    };
  }, []);

  useInput((input) => {
    switch (input) {
      case shortcuts.record:
        run();
        break;
      case shortcuts.clean:
        for (const file of fs.readdirSync(profileStore)) {
          if (/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}\.json$/.test(file)) {
            fs.removeSync(path.join(profileStore, file));
          }
        }
        break;
    }
  });

  return (
    <>
      <Divider bold>
        {`Profiles (${shortcuts.record}) Create a new profile (${shortcuts.clean}) Clean temp profiles`}
      </Divider>
      {profiles.map((file) => (
        <Text key={file}>{file}</Text>
      ))}
    </>
  );
}

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);
  const webPort: number = +(process.env.DEV_SERVER_PORT ?? 9633);

  await fs.mkdirp(profileStore);

  const browser = await puppeteer.launch({
    userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: ['--start-fullscreen', `--remote-debugging-port=${remoteDebuggingPort}`],
    devtools: true,
  });

  await start({
    app: 'app',
    port: webPort,
    children: (
      <ProfileRepeater
        browser={browser}
        pageUrl={`http://localhost:${webPort}`}
        shortcuts={{ record: 'x', clean: 'c' }}
      />
    ),
  });
})();
```

# Quick start React Web app development

<https://github.com/rocket-hangar/rocket-scripts-templates/blob/master/templates/web/README.md>

```sh
# create a workspace directory
npx generate-github-directory https://github.com/rocket-hangar/workspace-template my-project
cd my-project

# create an app
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/web my-app

# add "my-app" to workspaces of package.json

# install
yarn

# start
cd my-app

# start
yarn run start
```

<details>
<summary>Fish shell function</summary>

```fish
# add ~/.config/fish/config.fish
function generate-web-project
  set project $argv[1]
  set app $argv[2]

  if [ -z $project ] || [ -z $app ]
    echo "Undefined arguments $project $app : generate-web-project project app"
  else
    # create a workspace directory
    generate-github-directory https://github.com/rocket-hangar/workspace-template $project
    cd $project

    # create an app
    generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/web $app
    cd $app

    cd ..

    echo "👍 Generated! follow next steps"
    echo "Add $app to workspaces of package.json"
    echo "And, yarn install"
    
    # open project in your IDE
    # webstorm .
    # code .
  end
end
```

</details>

# Quick start React Electron app development

<https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/electron>

```sh
# create a workspace directory
npx generate-github-directory https://github.com/rocket-hangar/workspace-template my-project
cd my-project

# create an app
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/electron my-app

# add "my-app" to workspaces of package.json

# install
yarn

# directory
cd my-app

# start
yarn run start
```

# More repositories for reference

- <https://github.com/rocket-hangar/rocket-scripts-templates>

# Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/handbook>
- <https://github.com/rocket-hangar/generate-github-directory>