import { RedirectUrlPayload, ShortenUrlPayload } from 'types/eventTypes';
import { EventHandlerService } from '../eventHandler';
import {
  UrlRedirectStatsDao,
  UrlRedirectStatsDaoImpl,
} from '../../db/postgres/dao/urlRedirectStatsDao';
import {
  UrlShortenStatsDao,
  UrlShortenStatsDaoImpl,
} from '../../db/postgres/dao/urlShortenStatsDao';
import logger from '../../utils/logger';

// TODO: test
export class EventHandlerServiceImpl implements EventHandlerService {
  private urlRedirectStatsDao: UrlRedirectStatsDao;
  private urlShortenStatsDao: UrlShortenStatsDao;

  public constructor(
    UrlRedirectStatsDao: UrlRedirectStatsDao,
    urlShortenStatsDao: UrlShortenStatsDao
  ) {
    this.urlRedirectStatsDao = UrlRedirectStatsDao;
    this.urlShortenStatsDao = urlShortenStatsDao;
  }

  public static defaultImpl(): EventHandlerService {
    return new EventHandlerServiceImpl(
      new UrlRedirectStatsDaoImpl(),
      new UrlShortenStatsDaoImpl()
    );
  }

  public async handleRedirectUrl(payload: RedirectUrlPayload): Promise<void> {
    logger.info(`handleRedirectUrl event handler: `, { payload });
    try {
      await this.urlRedirectStatsDao.insert(payload.payload.hash);
    } catch (e) {
      logger.error('Encountered error when handling redirect url event: ', e);
    }
    return;
  }

  public async handleShortenUrl(payload: ShortenUrlPayload): Promise<void> {
    logger.info(`handleShortenUrl event handler: `, { payload });
    try {
      await this.urlShortenStatsDao.insert(
        payload.payload.originalUrl,
        payload.payload.alias
      );
    } catch (e) {
      logger.error('Encountered error when handling shorten url event: ', e);
    }
    return;
  }
}
