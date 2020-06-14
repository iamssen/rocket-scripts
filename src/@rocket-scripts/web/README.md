# start

env (inline or system) 
-> root .env.js 
-> app .env.js 
-> command (build.ts) parse env to params 
-> func (buildPackage.ts) 여기서부터는 process.env 사용하지 않음

```js
export function build({}: Params) {
}

export const commands = {
  build: ({cwd, args: [app]}) => {
    const env = pipe(
      xenv(path.join(cwd, '.env.js')),
      xenv(path.join(cwd, `src/${app}/.env.js`)),
    )(process.env)

    build({
      port: env.PORT,
    })
  }
}
```
