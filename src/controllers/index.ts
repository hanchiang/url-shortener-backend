import { Response } from 'express';
import {
  ValidatedRequest,
  // Extend from this to define a valid schema type/interface
} from 'express-joi-validation';
import { ShortenUrlRequest } from './types';
import { ShortenUrlSchema } from '../controllers/validators';
import { UrlShortenerServiceImpl } from '../services/impl/urlShortener';

export const shortenUrl = async (
  req: ValidatedRequest<ShortenUrlSchema>,
  res: Response
) => {
  const { url, alias }: ShortenUrlRequest = req.body;
  const shortenUrlService = new UrlShortenerServiceImpl();
  const shortenedUrl = await shortenUrlService.shortenUrl(url, alias);
  res.json(shortenedUrl);
};
