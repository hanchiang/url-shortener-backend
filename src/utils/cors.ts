import cors from 'cors';
import logger from '../utils/logger';

export const corsCheck = () => {
  return cors({
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
  });
};
