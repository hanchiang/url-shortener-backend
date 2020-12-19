import {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';

import { ObjectionError } from '../types/objection';
import { ErrorCode } from '../utils/error';

export default (err): ObjectionError | void => {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        return {
          message: err.message,
          status: ErrorCode.BAD_REQUEST,
          type: err.type,
          meta: err.data,
        };
      case 'RelationExpression':
        return {
          message: err.message,
          status: ErrorCode.BAD_REQUEST,
          type: err.type,
        };
      case 'UnallowedRelation':
        return {
          message: err.message,
          status: ErrorCode.BAD_REQUEST,
          type: err.type,
        };
      case 'InvalidGraph':
        return {
          message: err.message,
          status: ErrorCode.BAD_REQUEST,
          type: err.type,
        };
      default:
        return {
          message: err.message,
          status: ErrorCode.BAD_REQUEST,
          type: 'UnknownValidationError',
        };
    }
  } else if (err instanceof NotFoundError) {
    return {
      message: err.message,
      status: ErrorCode.NOT_FOUND,
      type: 'NotFound',
    };
  } else if (err instanceof UniqueViolationError) {
    return {
      message: err.message,
      status: ErrorCode.CONFLICT,
      type: 'UniqueViolation',
      meta: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
    };
  } else if (err instanceof NotNullViolationError) {
    return {
      message: err.message,
      status: ErrorCode.BAD_REQUEST,
      type: 'NotNullViolation',
      meta: {
        column: err.column,
        table: err.table,
      },
    };
  } else if (err instanceof ForeignKeyViolationError) {
    return {
      message: err.message,
      status: ErrorCode.CONFLICT,
      type: 'ForeignKeyViolation',
      meta: {
        table: err.table,
        constraint: err.constraint,
      },
    };
  } else if (err instanceof CheckViolationError) {
    return {
      message: err.message,
      status: ErrorCode.BAD_REQUEST,
      type: 'CheckViolation',
      meta: {
        table: err.table,
        constraint: err.constraint,
      },
    };
  } else if (err instanceof DataError) {
    return {
      message: err.message,
      status: ErrorCode.BAD_REQUEST,
      type: 'InvalidData',
    };
  } else if (err instanceof DBError) {
    return {
      message: err.message,
      status: ErrorCode.INTERNAL_SERVER_ERROR,
      type: 'UnknownDatabaseError',
    };
  } else {
    // return {
    //   message: err.message,
    //   status: ErrorCode.INTERNAL_SERVER_ERROR,
    //   type: 'UnknownError'
    // }
  }
};
