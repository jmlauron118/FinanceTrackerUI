import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
//Original Code 10/31/2025
// app.get('**', (req, res, next) => {
//   const { protocol, originalUrl, baseUrl, headers } = req;

//   commonEngine
//     .render({
//       bootstrap,
//       documentFilePath: indexHtml,
//       url: `${protocol}://${headers.host}${originalUrl}`,
//       publicPath: browserDistFolder,
//       providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
//     })
//     .then((html) => res.send(html))
//     .catch((err) => next(err));
// });

app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  // ✅ SSR-side redirect to prevent rendering login page if token exists in cookies
  const token = req.cookies?.['ft_access_token'] || req.headers['authorization'];

  if (originalUrl.startsWith('/login') && token) {
    // Redirect immediately to dashboard instead of rendering login
    return res.redirect('/dashboard');
  }

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});


/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
