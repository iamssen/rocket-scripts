import { build } from '@rocket-scripts/web';

(async () => {
  await build({
    app: 'app',
    isolatedScripts: {
      isolate: 'isolate.ts'
    }
  });
})();
