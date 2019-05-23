# react-zeroconfig

[![NPM](https://img.shields.io/npm/v/react-zeroconfig.svg)](https://www.npmjs.com/package/react-zeroconfig)
[![CircleCI](https://circleci.com/gh/react-zeroconfig/react-zeroconfig.svg?style=svg)](https://circleci.com/gh/react-zeroconfig/react-zeroconfig)
[![DeepScan grade](https://deepscan.io/api/teams/3270/projects/5643/branches/43640/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3270&pid=5643&bid=43640)
[![Coverage Status](https://coveralls.io/repos/github/react-zeroconfig/react-zeroconfig/badge.svg?branch=develop)](https://coveralls.io/github/react-zeroconfig/react-zeroconfig?branch=develop)

# 🚀 Quick Start

```bash
npm install -g create-zeroconfig-app

create-zeroconfig-app my-app
```

# Options

- `zeroconfig-webapp-scripts`
  - `zeroconfig-webapp-scripts build {your-app}` Build your app
    - `--size-report true|false` Open bundle size report (default: `false`)
    - `--mode production|development` Webpack mode (default: `production`)
    - `--output /path/to` Output path (default: `dist/{your-app}`)
    - `--app-file-name app` Output bundle js file name (default: `app`)
    - `--vendor-file-name vendor` Output bundle js file name (default: `vendor`)
    - `--style-file-name style` Output bundle js file name (default: `style`)
    - `--chunk-path chunk/path` Output chunk files location (default: `""`)
    - `--public-path public/path` Webpack public path (default: `""`)
  - `zeroconfig-webapp-scripts start {your-app}`
    - `--port 3100` Dev web server port (default: `3100`)
    - `--server-port 4100` Dev SSR server port (default: `4100`)
    - `--https true` Use https (default: `false`)
    - `--https-key path-to-custom.key --https-cert path-to-custom.crt` Use https 
- `zeroconfig-package-scripts` 
  - `zeroconfig-package-scripts build` Build your packages
  - `zeroconfig-package-scripts publish` Publish your packages to npm registry
  
# Samples

- <https://github.com/react-zeroconfig/fixtures>

# Import Types

## Javascript and Typescript (`*.ts` `*.tsx` `*.js` `*.jsx`)

<https://www.npmjs.com/package/babel-loader>

Typescript and ES6 are supported. (Flow is not supported)

```jsx
import React from 'react';
import { Test } from './Test';

export function App() {
  return <Test value="Seoyeon"/>;
}
```

## Web Worker (`*.worker.ts`, `*.worker.js`)

<https://www.npmjs.com/package/worker-loader>

```jsx
import Worker from './file.worker';

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = function (event) {};

worker.addEventListener("message", function (event) {});
```

## CSS (`*.css` `*.scss` `*.less`)

Supports CSS and CSS pre-processors SASS and LESS.

Vendor prefix is automatically processed. If you do not declare a vendor prefix such as `-webkit-`, it will be handled automatically.

```css
.foo {
  font-size: 20px;
}
```

```jsx
import React from 'react';
import './style.scss';

export function App() {
  return (
    <div className="foo">
      Hello, World!
    </div>
  )
}
```

## CSS Module (`*.module.css` `*.module.scss` `*.module.less`)

Supports CSS Module.

Attaching `.module.` like `style.module.css` or `style.module.scss` works as a CSS Module.

```css
.foo {
  font-size: 20px;
}
```

```jsx
import React from 'react';
import styles from './style.scss';

export function App() {
  return (
    <div className={styles.foo}>
      Hello, World!
    </div>
  )
}
```

## SVG (`*.svg`)

When you import an SVG file, you will send the URL address of the SVG file as `default` and the SVG React Component converted to React Component as `ReactComponent`.

```jsx
import React from 'react';
import svgUrl, { ReactComponent } from './image.svg';

export function App() {
  return (
    <div>
      <img src={svgUrl}/>
      <ReactComponent/>
    </div>
  )
}
```

## Json (`*.json`)

Json file is imported as Object type. (Babel basic function)

```json
{
  "key": "value"
}
```

```jsx
import React from 'react';
import object from './data.json';

export function App() {
  return (
    <div>
      Value is {object.key}
    </div>
  )
}
```

## Image (`*.bmp` `*.gif` `*.png` `*.jpg`)

Importing image files will get the URL of the image.

```jsx
import React from 'react';
import imageUrl from './image.png';

export function App() {
  return <img src={imageUrl}/>;
}
```

## Plain Text (`*.html` `*.txt` `*.md` `*.ejs`)

Text files such as HTML, Markdown, and EJS will be imported into plain text.

```jsx
import React from 'react';
import { Markdown } from 'react-devdocs';
import wikiText from './wiki.md';

export function App() {
  return <Markdown text={wikiText} />;
}
```

## Raw Loader (`!!raw-loader!`)

If you use Raw Loader, you will be able to import all files into plain text.

This is helpful if you need to import the source code into plain text.

```jsx
import React from 'react';
import { CodeBlock } from 'react-devdocs';

export function App() {
  return <CodeBlock value={require('!!raw-loader!./Component')} language="tsx"/>;
}
```

# License
`react-zeroconfig` is open source software licensed as MIT.