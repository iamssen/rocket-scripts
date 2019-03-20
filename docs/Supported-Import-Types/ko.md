<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

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

# 지원되는 Import 유형들

# Javascript and Typescript (`*.ts` `*.tsx` `*.js` `*.jsx`)

Typescript와 ES6를 지원합니다. (Flow는 지원하지 않습니다)

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

CSS와 CSS Pre-processor인 SASS, LESS를 지원합니다.

Vendor Prefix를 자동으로 처리합니다. `-webkit-`과 같은 Vendor Prefix를 선언하지 않아도 자동으로 처리되게 됩니다.

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

CSS Module을 지원합니다. 

`style.module.css` 또는 `style.module.scss` 와 같은 식으로 `.module.`을 붙이면 CSS Module로 작동하게 됩니다.

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

SVG File을 import 하는 경우 `default`로 SVG File의 URL 주소를, `ReactComponent`로 React Component로 변환된 SVG React Element를 보내주게 됩니다. 

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

Json 파일을 Object 형태로 import 하게 됩니다. (Babel 기본 기능)

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

Image 파일들을 import하면 Image의 URL을 가져오게 됩니다.

- <https://github.com/iamssen/react-zeroconfig/blob/master/src/webpack/app.ts#L70>

```jsx
import React from 'react';
import imageUrl from './image.png';

export function App() {
  return <img src={imageUrl}/>;
}
```

# Plain Text (`*.html` `*.txt` `*.md` `*.ejs`)

HTML, Markdown, EJS와 같은 Text 파일들은 Plain Text로 import 되게 됩니다.

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

Raw Loader를 사용할 경우 모든 파일들을 Plain Text로 가져올 수 있게됩니다. 

이는 Source Code를 Plain Text로 가져와야 하는 경우 도움이 됩니다.

```jsx
import React from 'react';
import { CodeBlock } from 'react-devdocs';

export function App() {
  return <CodeBlock value={require('!!raw-loader!./Component')} language="tsx"/>;
}
```
