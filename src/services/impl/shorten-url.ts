import { ShortenUrl } from '../shorten-url';
import { KeyGenerationService } from './key-generation';
import { KeyGeneration } from '../key-generation';
import config from '../../config';
import { Url } from '../../models/url';
import { throwError, ErrorCode } from '../../utils/error';
import { urlSafe } from '../../utils/url-safe';

export class ShortenUrlService implements ShortenUrl {
  // private urlRepository: Repository<Url>
  private keyGenerationService: KeyGeneration;
  constructor() {
    this.keyGenerationService = new KeyGenerationService();
    // this.urlRepository = getRepository(Url);
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
      key = await this.getAvailabkeKey();
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
  private async getAvailabkeKey(): Promise<string> {
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
