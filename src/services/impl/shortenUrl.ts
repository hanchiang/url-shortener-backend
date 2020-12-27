import { ShortenUrl } from '../shorten-url';
import { KeyGenerationService } from './keyGeneration';
import { KeyGeneration } from '../keyGeneration';
import config from '../../config';
import { Url } from '../../models/url';
import { throwError, ErrorCode } from '../../utils/error';
import { urlSafe } from '../../utils/urlSafe';

export class ShortenUrlService implements ShortenUrl {
  private keyGenerationService: KeyGeneration;
  constructor() {
    this.keyGenerationService = new KeyGenerationService();
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
      const keys = this.keyGenerationService.generate();

      const urlsInDb = await Url.query().findByIds(keys);
      const keysUsed: { [key: string]: boolean } = {};
      for (const urlInDb of urlsInDb) {
        keysUsed[urlInDb.id] = true;
      }
      for (const key of keys) {
        if (!keysUsed[key]) {
          result = key;
          foundAvailableKey = true;
          break;
        }
      }
    } while (!foundAvailableKey);
    return result;
  }

  private constructShortenedUrl(urlKey: string): string {
    return `${config.baseDomain}/${urlKey}`;
  }
}
