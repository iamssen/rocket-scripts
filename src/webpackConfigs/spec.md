# ruleset include, exclude 상황

## webpack configs
- getWebpackScriptLoaders
- getWebpackWebWorkerLoaders
- getWebpackRawTextLoaders
- getWebpackStyleLoaders
- getWebpackDataURILoaders
- getWebpackFileLoaders

## sources

- source code (babel-loader)
  - include : src
  - js, jsx, ts, tsx, mjs
- worker source code (worker-loader, babel-loader)
  - include : src
  - js, jsx, ts, tsx, mjs
- text (raw-loader)
  - html, ejs, txt, md
- images (url-loader)
  - bmp, gif, jpg, jpeg, png
- style
  - css, scss, sass, less + .module.[ext]
- files (file-loader)
  - exclude: js, mjs, jsx, ts, tsx, html, json
  


## webapp

- browser
  - tslint-loader
  - oneOf
    - dataurl          : url-loader
    - sourc code       : <src> babel-loader
    - raw text         : raw-loader
    - webworker source : <src> worker-loader, babel-loader 
    - style sources    : 
    - file             : file-loader
- server === browser

## package

- package
  - tslint-loader
  - oneOf
    - source code
    - raw text
    - style sources

## patchStorybookWebpackConfig

- storybook
  - oneOf
    - source code
    - raw text
    - style sources


- inline
  - tslint-loader
  - oneOf
    - getWebpackBasicLoaders
      - babel-loader
        - include: src
        - getBabelConfig({modules: false})
      - raw-loader
        - html, ejs, txt, md
    - getWebpackStyleLoaders
    
## jest-preset-files/transform.js
- inline
  - getBabelConfig({modules: 'commonjs'})