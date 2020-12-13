import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { throwError } from '../util/error';
import { CustomError } from '../types/error';

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
    const retVal: any = {};
    if (res.statusCode >= 400) {
      retVal.error = data;
    } else {
      retVal.payload = data;
    }
    return oldJson.call(res, retVal);
  };
  next();
};

export const catchErrors = (action: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => action(req, res).catch(next);

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'An error ocurred';
  const error: any = {
    message: err.message || message,
  };
  if (config.nodeEnv !== 'production') {
    error.stack = err.stack;
  }
  res.status(status).json(error);
};
