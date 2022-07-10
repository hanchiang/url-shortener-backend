import express, { Request, Response } from 'express';
import cors from 'cors';
import * as middlewares from '../middlewares';
import * as controllers from '../controllers';
import {
  validator,
  shortenUrlValidator,
  healthCheckValidator,
} from '../controllers/validators';
import { corsCheck } from '../utils/cors';

const router = express.Router();

router.get(
  '/',
  cors(),
  middlewares.catchErrors(async (req: Request, res: Response) => {
    res.json({
      message: 'Service is up and running!',
    });
  })
);

router.get(
  '/healthz',
  cors(),
  validator.query(healthCheckValidator),
  middlewares.catchErrors(controllers.healthCheck)
);

router.options('/urls', corsCheck());
router.post(
  '/urls',
  corsCheck(),
  validator.body(shortenUrlValidator),
  middlewares.catchErrors(controllers.shortenUrl)
);
router.get(
  '/:urlKey',
  cors(),
  middlewares.catchErrors(controllers.redirectUrl)
);

export default router;
