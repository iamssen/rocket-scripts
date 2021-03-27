import { start } from '@rocket-scripts/web';
import { parseNumber } from '@rocket-scripts/utils';

(async () => {
  await start({
    app: 'app',
    port: parseNumber(process.env.PORT) ?? 'random',
    isolatedScripts: {
      isolate: 'isolate.ts'
    }
  });
})();
