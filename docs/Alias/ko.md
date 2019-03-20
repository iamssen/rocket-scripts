# Alias Rule

`react-zeroconfig`는 `src/*` 와 `src/_modules/*` 디렉토리들을 Webpack `resolve.alias` 항목으로 처리합니다. <https://github.com/iamssen/react-zeroconfig/blob/master/src/utils/webpack/getAlias.ts>

|file                            |import                                 |
|--------------------------------|---------------------------------------|
|`src/app/index.jsx`             |`import App from 'app'`                |
|`src/common/style/theme.scss`   |`import 'common/style/theme.scss'`     |
