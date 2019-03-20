<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [지원되는 Import 유형들](#%EC%A7%80%EC%9B%90%EB%90%98%EB%8A%94-import-%EC%9C%A0%ED%98%95%EB%93%A4)
- [Javascript and Typescript (`*.ts` `*.tsx` `*.js` `*.jsx`)](#javascript-and-typescript-ts-tsx-js-jsx)
- [CSS (`*.css` `*.scss` `*.less`)](#css-css-scss-less)
- [CSS Module (`*.module.css` `*.module.scss` `*.module.less`)](#css-module-modulecss-modulescss-moduleless)
- [SVG (`*.svg`)](#svg-svg)
- [Json (`*.json`)](#json-json)
- [Image (`*.bmp` `*.gif` `*.png` `*.jpg`)](#image-bmp-gif-png-jpg)
- [Plain Text (`*.html` `*.txt` `*.md` `*.ejs`)](#plain-text-html-txt-md-ejs)
- [Raw Loader (`!!raw-loader!`)](#raw-loader-raw-loader)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Supported import types

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

# Javascript and Typescript (`*.ts` `*.tsx` `*.js` `*.jsx`)

Typescript and ES6 are supported. (Flow is not supported)

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getDefaultLoaders.ts#L8>
- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/babel/getBabelConfig.ts>

```jsx
import React from 'react';
import { Test } from './Test';

export function App() {
  return <Test value="Seoyeon"/>;
}
```

# CSS (`*.css` `*.scss` `*.less`)

Supports CSS and CSS pre-processors SASS and LESS.

Vendor prefix is automatically processed. If you do not declare a vendor prefix such as `-webkit-`, it will be handled automatically.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/webpack/app.ts#L80>
- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getStyleLoaders.ts>

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

# CSS Module (`*.module.css` `*.module.scss` `*.module.less`)

Supports CSS Module.

Attaching `.module.` like `style.module.css` or `style.module.scss` works as a CSS Module.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/webpack/app.ts#L80>
- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getStyleLoaders.ts#L10>

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

# SVG (`*.svg`)

When you import an SVG file, you will send the URL address of the SVG file as `default` and the SVG React Component converted to React Component as `ReactComponent`.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/babel/getBabelConfig.ts#L54>

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

# Json (`*.json`)

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

# Image (`*.bmp` `*.gif` `*.png` `*.jpg`)

Importing image files will get the URL of the image.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/webpack/app.ts#L70>

```jsx
import React from 'react';
import imageUrl from './image.png';

export function App() {
  return <img src={imageUrl}/>;
}
```

# Plain Text (`*.html` `*.txt` `*.md` `*.ejs`)

Text files such as HTML, Markdown, and EJS will be imported into plain text.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getDefaultLoaders.ts#L22>

```jsx
import React from 'react';
import { Markdown } from 'react-devdocs';
import wikiText from './wiki.md';

export function App() {
  return <Markdown text={wikiText} />;
}
```

# Raw Loader (`!!raw-loader!`)

If you use Raw Loader, you will be able to import all files into plain text.

This is helpful if you need to import the source code into plain text.

```jsx
import React from 'react';
import { CodeBlock } from 'react-devdocs';

export function App() {
  return <CodeBlock value={require('!!raw-loader!./Component')} language="tsx"/>;
}
```
