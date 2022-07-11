/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import config from '../config';
import logger from '../utils/logger';
import { throwError } from '../utils/error';
import { CustomError } from '../types/error';
import {
  ErrorResponse,
  SuccessResponse,
  ErrorPayload,
} from '../types/response';
import formatObjectionError from '../utils/objectionError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  throwError({
    status: 404,
    message: `${req.method} ${req.path} is not found`,
  });
};

/**
 * Response interceptor
 */
export const formatResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldJson = res.json;

  res.json = function (data) {
    const retVal: Partial<SuccessResponse | ErrorResponse> = {};
    if (res.statusCode >= 400) {
      logError(data);
      (retVal as ErrorResponse).error = data;
    } else {
      (retVal as SuccessResponse).payload = data;
    }
    return oldJson.call(res, retVal);
  };
  next();
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const logError = (err: any) => {
  const errorClone = { ...err };
  logger.error(errorClone);
};

export const catchErrors =
  (action: Function) => (req: Request, res: Response, next: NextFunction) =>
    action(req, res).catch(next);

export const errorHandler = (
  err: CustomError | ExpressJoiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status;
  let message;
  let stack;
  let meta;
  let type;

  if ((err as ExpressJoiError)?.error?.isJoi) {
    const { _original, details } = (err as ExpressJoiError).error;
    logger.error(`Joi error.`, { original: _original, details: details });

    const customError = details.find((d) => d.type === 'any.custom');
    if (customError) {
      // Don't want to log the entire error message, just the error message that was
      // from the custom validator
      const split = customError.message?.split('because');
      message = split[1].trim();
    } else {
      message = details.map((d) => d.message).join(', ');
    }

    status = 400;
  } else {
    const objectionError = formatObjectionError(err);
    if (objectionError) {
      ({ message, status, meta, type } = objectionError);
      logger.error('Objection error.', { message, status, meta, type });
    } else {
      err = err as CustomError;
      status = status || err.status || 500;
      message = message || err.message || err || 'An error occurred';
      stack = err.stack;
      logger.error('Application error.', { err, status, message, stack });
    }
  }

  const error: ErrorPayload = { message, type, meta };
  if (config.nodeEnv !== 'production') {
    error.stack = stack;
  }
  res.status(status).json(error);
};
