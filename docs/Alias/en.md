# Alias Rule

> ⚠️ I can not speak English well. It will be helpful if you correct the wrong expressions and send the PR. (If you have modified this document, please delete this comment.)

`react-zeroconfig` sets the `src/*` and `src/_modules/*` directories to Webpack `resolve.alias` entries. <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getAlias.ts>

|file                            |import                                 |
|--------------------------------|---------------------------------------|
|`src/app/index.jsx`             |`import App from 'app'`                |
|`src/common/style/theme.scss`   |`import 'common/style/theme.scss'`     |
