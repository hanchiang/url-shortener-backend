import Sinon from 'sinon';

import { UrlShortenerServiceImpl } from '../../../src/services/impl/urlShortener';
import { UrlDaoImpl } from '../../../src/db/postgres/dao/urlDao';
import { Redis } from '../../../src/db/redis';

describe('UrlShortenerService unit tests', () => {
  afterEach(() => {
    Sinon.restore();
  });

  it('Should shorten url with alias if it does not already exist', async () => {
    const url = 'www.google.com';
    const alias = 'abc';

    Sinon.stub(
      UrlShortenerServiceImpl.prototype,
      'ensureAliasDoesNotExist' as any
    ).resolves();
    Sinon.stub(UrlDaoImpl.prototype, 'insert').resolves();
    Sinon.stub(Redis, 'getInstance' as any).resolves();

    const urlShortenerService = new UrlShortenerServiceImpl();
    await urlShortenerService.shortenUrl(url, alias);
  });
});
