import { TransformEnvFunction } from '@ssen/env';

export default ((env) => {
  return {
    ...env,
    FOO: 'BAR',
  };
}) as TransformEnvFunction;
