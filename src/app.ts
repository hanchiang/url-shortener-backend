import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import helmet from 'helmet';
import cors from 'cors';

import { initDb } from './db';
import routes from './routes';
import * as middlewares from './middlewares';
import logger from './utils/logger';

initDb();

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(
  cors({
    origin: (origin, cb) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
      if (allowedOrigins.includes(origin)) {
        cb(null, origin);
      } else {
        logger.warn(
          `Unauthorised accessed from origin: ${origin}. Allowed origins: ${allowedOrigins}`
        );
        cb('error', null);
      }
    },
  })
);
app.use(bodyParser.json());
app.use(helmet());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(middlewares.formatResponse);

app.use(routes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
