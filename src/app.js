import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';

import { routes } from './routes';
import { HttpError } from './errors';

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

  app.use((error, _request, response, _next) => {
    if (error instanceof HttpError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    return response.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

export { appFactory };
