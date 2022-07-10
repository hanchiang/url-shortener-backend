import { ThrowError, CustomError } from '../types/error';

export enum ErrorCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const throwError = (errObj: ThrowError) => {
  const error: Partial<CustomError> = new Error(errObj.message);
  error.status = errObj.status;
  throw error;
};
