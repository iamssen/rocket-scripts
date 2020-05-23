# Require from Typescript source

```ts
// hello.ts
export const hello: number = 3;
```

```js
// main
import { requireTypescript } from '@ssen/require-typescript';

const { hello } = requireTypescript('./hello.ts');
console.assert(hello === 3);
```
