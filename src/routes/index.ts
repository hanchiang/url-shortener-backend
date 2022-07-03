import express, { Request, Response } from 'express';
import cors from 'cors';
import * as middlewares from '../middlewares';
import * as controllers from '../controllers';
import { shortenUrlValidator, validator } from '../controllers/validators';
import { corsCheck } from '../utils/cors';

const router = express.Router();

router.get(
  '/',
  cors(),
  middlewares.catchErrors(async (req: Request, res: Response) => {
    res.json('Service is up and running!');
  })
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
