import { Request, Response, NextFunction } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import config from '../config';
import logger from '../utils/logger';
import { throwError } from '../utils/error';
import { CustomError } from '../types/error';
import { ErrorResponse, SuccessRespone } from '../types/response';
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
    const retVal: Partial<SuccessRespone | ErrorResponse> = {};
    if (res.statusCode >= 400) {
      logError(data);
      (retVal as ErrorResponse).error = data;
    } else {
      (retVal as SuccessRespone).payload = data;
    }
    return oldJson.call(res, retVal);
  };
  next();
};

const logError = (err: any) => {
  const errorClone = { ...err };
  logger.error(errorClone);
};

export const catchErrors = (action: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => action(req, res).catch(next);

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
    message = (err as ExpressJoiError).error.toString();
    status = 400;
  } else {
    const objectionError = formatObjectionError(err);
    if (objectionError) {
      ({ message, status, meta, type } = objectionError);
    } else {
      err = err as CustomError;
      status = status || 500;
      message = message || 'An error occurred';
      stack = err.stack;
    }
  }

  const error: any = { message, type, meta };
  if (config.nodeEnv !== 'production') {
    error.stack = stack;
  }
  res.status(status).json(error);
};
