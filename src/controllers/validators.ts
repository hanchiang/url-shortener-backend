import * as Joi from 'joi';
import {
  ContainerTypes,
  // Use this as a replacement for express.Request
  ValidatedRequestSchema,
  // Creates a validator that generates middlewares
  createValidator,
} from 'express-joi-validation';
import { MAX_ALIAS_LENGTH } from '../constants';

export const validator = createValidator({
  passError: true,
});

export const shortenUrlValidator = Joi.object({
  url: Joi.string().uri().required(),
  alias: Joi.string().max(MAX_ALIAS_LENGTH),
});

export interface ShortenUrlSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    url: string;
    alias?: string;
  };
}

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
