import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import url from 'url';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import { routes } from './routes';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { NotFoundMiddleware } from './middlewares/not-found.middleware';
import { HttpError } from './errors';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Creates a express instance and configure it
 *
 * @returns {import('express').Express}
 */
function appFactory() {
  const app = express();
  const errorHandlerMiddleware = new ErrorHandlerMiddleware();
  const notFoundMiddleware = new NotFoundMiddleware();

  function sentryShouldHandleError(error) {
    return !(error instanceof HttpError);
  }

  /* Init sentry */
  if (isProduction) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
    });
  }

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  /* Setup sentry middlewares */
  if (isProduction) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.use('/api', routes);
  app.use(express.static(path.join(dirname, '..', 'public')));

  /* Sentry error handler */
  if (isProduction) {
    app.use(Sentry.Handlers.errorHandler({ shouldHandleError: sentryShouldHandleError }));
  }

  app.use('/api/*', notFoundMiddleware.handler);
  app.use(errorHandlerMiddleware.handler);

  return app;
}

export { appFactory };
