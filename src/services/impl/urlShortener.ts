import { UrlShortenerService } from '../urlShortener';
import { KeyGenerationServiceImpl } from './keyGeneration';
import { KeyGeneration } from '../keyGeneration';
import config from '../../config';
import { throwError, ErrorCode } from '../../utils/error';
import { urlSafe } from '../../utils/urlSafe';
import { MemoryStore, Redis } from '../../db/redis';
import { UrlDao, UrlDaoImpl } from '../../db/postgres/dao/urlDao';
import logger from '../../utils/logger';

export class UrlShortenerServiceImpl implements UrlShortenerService {
  private keyGenerationService: KeyGeneration;
  private urlDao: UrlDao;
  private redis: MemoryStore;

  constructor() {
    this.redis = Redis.getInstance();
    this.keyGenerationService = new KeyGenerationServiceImpl();
    this.urlDao = new UrlDaoImpl();
  }

  public async shortenUrl(
    originalUrl: string,
    alias?: string
  ): Promise<string> {
    let key;
    if (alias) {
      await this.ensureAliasDoesNotExist(alias);
      key = urlSafe(alias);
    } else {
      key = await this.getAvailableKey();
    }

    logger.info(
      `Shorten URL ${originalUrl}, ${alias ? `alias ${alias}` : ''}, key ${key}`
    );

    await this.urlDao.insert(key, originalUrl);
    return this.constructShortenedUrl(key);
  }

  public async getOriginalUrl(urlKey: string): Promise<string> {
    const cachedData = await this.redis.getString(urlKey);
    // TODO: Test. Log cache hit or miss
    if (cachedData) {
      logger.info(`Found short URL ${urlKey} from cache`);
      return cachedData;
    }

    logger.info(
      `Did not find short URL ${urlKey} from cache. Searching in database.`
    );
    const urlInDb = await this.urlDao.findById(urlKey);
    if (!urlInDb) {
      throwError({
        status: ErrorCode.NOT_FOUND,
        message: `/${urlKey} does not exist`,
      });
    }
    await this.redis.setString(urlKey, urlInDb.originalUrl);
    return urlInDb.originalUrl;
  }

  private async ensureAliasDoesNotExist(alias: string): Promise<void> {
    const url = await this.urlDao.findById(alias);
    if (url) {
      throwError({
        status: ErrorCode.CONFLICT,
        message: `Alias ${alias} is already taken. Please use another alias`,
      });
    }
  }

  private async getAvailableKey(): Promise<string> {
    let result;
    let foundAvailableKey = false;
    let iterations = 0;
    do {
      const generatedKeys = this.keyGenerationService.generate();
      const urlsInDb = await this.urlDao.findByIds(generatedKeys);
      const keysUsed: { [key: string]: boolean } = {};
      for (const urlInDb of urlsInDb) {
        keysUsed[urlInDb.id] = true;
      }
      for (const generatedKey of generatedKeys) {
        if (!keysUsed[generatedKey]) {
          result = generatedKey;
          foundAvailableKey = true;
          break;
        }
      }
      iterations++;
    } while (!foundAvailableKey);
    logger.info(
      `Found an available key in ${iterations} ${
        iterations > 1 ? 'iterations' : 'iteration'
      }`
    );
    return result;
  }

  public constructShortenedUrl(urlKey: string): string {
    return `${config.baseDomain}/${urlKey}`;
  }
}
