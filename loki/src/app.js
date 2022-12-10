import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';

import { routes } from './routes';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { NotFoundMiddleware } from './middlewares/not-found.middleware';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Creates a express instance and configure it
 *
 * @returns {import('express').Express}
 */
function appFactory() {
  const app = express();
  const errorHandlerMiddleware = new ErrorHandlerMiddleware();
  const notFoundMiddleware = new NotFoundMiddleware();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api', routes);
  app.use(express.static(path.join(dirname, '..', 'public')));
  app.use('/api/*', notFoundMiddleware.handler);
  app.use(errorHandlerMiddleware.handler);

  return app;
}

export { appFactory };
