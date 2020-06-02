# `@ssen/env`

Create a map file.

```ts
import { TransformEnvFunction } from '@ssen/env';

export default ((env) => {
  return {
    ...env,
    NODE_ENV: 'development',
  }
}) as TransformEnvFunction;
```

And, you can map your env with the map file.

```ts
import { mapEnv } from '@ssen/env';

const mappedEnv: NodeJs.ProcessEnv = mapEnv('.env')(process.env);
```