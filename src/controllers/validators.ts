import * as Joi from 'joi';
import xss from 'xss';
import {
  ContainerTypes,
  // Use this as a replacement for express.Request
  ValidatedRequestSchema,
  // Creates a validator that generates middlewares
  createValidator,
} from 'express-joi-validation';
import { MAX_ALIAS_LENGTH } from '../constants';
import { throwError } from '../utils/error';
import logger from '../utils/logger';

export const validator = createValidator({
  passError: true,
});

export const xssJoiValidator = (value, helpers) => {
  const sanitised = xss(value);
  logger.info(
    `sanitised: ${sanitised}, value: ${value}, original: ${helpers.original}`
  );
  if (value !== sanitised) {
    throwError({
      status: 400,
      message: 'Invalid input',
    });
  }
  return sanitised;
};

export const healthCheckValidator = Joi.object({
  postgres: Joi.string().min(0),
  redis: Joi.string().min(0),
});

export interface HealthCheckSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    postgres?: string;
    redis?: string;
  };
}

export const shortenUrlValidator = Joi.object({
  url: Joi.string().custom(xssJoiValidator).uri().required(),
  alias: Joi.string().custom(xssJoiValidator).max(MAX_ALIAS_LENGTH),
});

export interface ShortenUrlSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    url: string;
    alias?: string;
  };
}

export const redirectUrlValidator = Joi.object({
  urlKey: Joi.string().custom(xssJoiValidator).required(),
});

export interface RedirectUrlSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    urlKey: string;
  };
}
