import { RedirectUrlPayload, ShortenUrlPayload } from 'types/eventTypes';
import { EventHandlerService } from '../eventHandler';
import logger from '../../utils/logger';

// TODO: test
export class EventHandlerServiceImpl implements EventHandlerService {
  public handleRedirectUrl(payload: RedirectUrlPayload): Promise<void> {
    logger.info(`handleRedirectUrl: `, { payload });
    return;
  }

  public handleShortenUrl(payload: ShortenUrlPayload): Promise<void> {
    logger.info(`handleShortenUrl: `, { payload });
    return;
  }
}
