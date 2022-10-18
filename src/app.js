import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';

import { routes } from './routes';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Creates a express instance and configure it
 *
 * @returns {import('express').Express}
 */
function appFactory() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use('/api', routes);
  app.use(express.static(path.join(dirname, '..', 'public')));

  /** @todo: add error handler */

  return app;
}

export { appFactory };
