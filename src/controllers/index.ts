import { Response } from 'express';
import {
  ValidatedRequest,
  // Extend from this to define a valid schema type/interface
} from 'express-joi-validation';
import { ShortenUrlRequest } from './types';
import {
  ShortenUrlSchema,
  HealthCheckSchema,
  RedirectUrlSchema,
} from '../controllers/validators';
import { UrlShortenerServiceImpl } from '../services/impl/urlShortener';

import { UrlDaoImpl } from '../db/postgres/dao/urlDao';
import { Redis } from '../db/redis';
import { throwError, ErrorCode } from '../utils/error';
import logger from '../utils/logger';

export const healthCheck = async (
  req: ValidatedRequest<HealthCheckSchema>,
  res: Response
) => {
  const response: any = {
    message: 'Service is up and running!',
  };

  if (req.query.postgres !== undefined) {
    try {
      await new UrlDaoImpl().healthCheck();
      response.postgres = 'Postgres is up and running!';
    } catch (e) {
      logger.error(`postgres health check failed: ${e}`);
    }
  }
  if (req.query.redis !== undefined) {
    try {
      await Redis.getInstance().ping();
      response.redis = 'Redis is up and running!';
    } catch (e) {
      logger.error(`redis health check failed: ${e}`);
    }
  }

  res.json(response);
};

export const shortenUrl = async (
  req: ValidatedRequest<ShortenUrlSchema>,
  res: Response
) => {
  const { url, alias }: ShortenUrlRequest = req.body;
  const shortenUrlService = UrlShortenerServiceImpl.defaultImpl();
  const shortenedUrl = await shortenUrlService.shortenUrl(url, alias);
  res.json(shortenedUrl);
};

export const redirectUrl = async (
  req: ValidatedRequest<RedirectUrlSchema>,
  res: Response
) => {
  const { urlKey } = req.params;
  const shortenUrlService = UrlShortenerServiceImpl.defaultImpl();
  const originalUrl = await shortenUrlService.getOriginalUrl(urlKey);

  // TODO: Should render an error page
  if (!originalUrl) {
    throwError({
      status: ErrorCode.NOT_FOUND,
      message: `Short URL ${urlKey} does not exist`,
    });
  }
  res.redirect(307, originalUrl);
};
