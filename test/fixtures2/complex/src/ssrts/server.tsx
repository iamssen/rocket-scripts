import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { App } from 'app';
import { InitialState } from 'app/data/initialState';
import Koa from 'koa';
import Router, { RouterContext } from 'koa-router';
import React from 'react';
import { renderToString } from 'react-dom/server';

const port: number = Number(process.env.SERVER_PORT || 4100);

const app: Koa = new Koa();
const router: Router = new Router();

// ---------------------------------------------
// router
// ---------------------------------------------
router.get('/', async (ctx: RouterContext) => {
  ctx.body = await render(ctx, {
    serverValue: 'SERVER VALUE',
  });
});

// ---------------------------------------------
// start
// ---------------------------------------------
app.use(router.routes());
app.listen(port, () => {
  console.log(`SSR server started ${port}`);
});

// ---------------------------------------------
// render
// ---------------------------------------------
export async function render(ctx: RouterContext, initialState: InitialState): Promise<string> {
  const stats: object = require('loadable-stats.json');
  const extractor: ChunkExtractor = new ChunkExtractor({stats, entrypoints: 'app'});
  
  const body: string = renderToString((
    <ChunkExtractorManager extractor={extractor}>
      <App initialState={initialState}/>
    </ChunkExtractorManager>
  ));
  
  return template({
    body,
    initialState: JSON.stringify(initialState),
    extractor,
  });
}

// ---------------------------------------------
// template
// ---------------------------------------------
export const template: (params: {body: string, initialState: string, extractor: ChunkExtractor}) => string = ({body, initialState, extractor}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="#000000" />
    <link rel="shortcut icon" href="favicon.ico"/>
    <link rel="manifest" href="manifest.json" />
    <title>App</title>
    ${extractor.getLinkTags()}
    ${extractor.getStyleTags()}
    <script>
      window.__INITIAL_STATE__ = ${initialState.replace(/</g, '\\u003c')};
    </script>
  </head>
  
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="app">${body}</div>
    ${extractor.getScriptTags()}
  </body>
</html>
`;