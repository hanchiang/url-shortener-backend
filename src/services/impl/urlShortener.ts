import { UrlShortenerService } from '../urlShortener';
import { KeyGenerationServiceImpl } from './keyGeneration';
import { KeyGeneration } from '../keyGeneration';
import config from '../../config';
import { Url } from '../../models/url';
import { throwError, ErrorCode } from '../../utils/error';
import { urlSafe } from '../../utils/urlSafe';

export class UrlShortenerServiceImpl implements UrlShortenerService {
  private keyGenerationService: KeyGeneration;
  constructor() {
    this.keyGenerationService = new KeyGenerationServiceImpl();
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

    await Url.query().insert({
      id: key,
      originalUrl,
    });
    return this.constructShortenedUrl(key);
  }

  public async getOriginalUrl(urlKey: string): Promise<string> {
    const urlInDb = await Url.query().findById(urlKey);
    if (!urlInDb) {
      throwError({
        status: ErrorCode.NOT_FOUND,
        message: `/${urlKey} does not exist`,
      });
    }
    return urlInDb.originalUrl;
  }

  private async ensureAliasDoesNotExist(alias: string): Promise<void> {
    const url = await Url.query().findById(alias);
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
    do {
      const generatedKeys = this.keyGenerationService.generate();
      const urlsInDb = await Url.query().findByIds(generatedKeys);
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
    } while (!foundAvailableKey);
    return result;
  }

  public constructShortenedUrl(urlKey: string): string {
    return `${config.baseDomain}/${urlKey}`;
  }
}
