import express, { Request, Response } from 'express';
import * as middlewares from '../middlewares';
import * as controllers from '../controllers';
import { shortenUrlValidator, validator } from '../controllers/validators';
const router = express.Router();

router.get(
  '/',
  middlewares.catchErrors(async (req: Request, res: Response) => {
    res.json('Service is up and running!');
  })
);
router.post(
  '/urls',
  validator.body(shortenUrlValidator),
  middlewares.catchErrors(controllers.shortenUrl)
);
router.get('/:urlKey', middlewares.catchErrors(controllers.redirectUrl));

export default router;
