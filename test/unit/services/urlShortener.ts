import Sinon from 'sinon';

import { UrlShortenerServiceImpl } from '../../../src/services/impl/urlShortener';
import { UrlDaoImpl } from '../../../src/db/postgres/dao/urlDao';

describe('UrlShortenerService unit tests', () => {
  afterEach(() => {
    Sinon.restore();
  });

  it('Should shorten url with alias if it does not already exist', async () => {
    const url = 'www.google.com';
    const alias = 'abc';
    const urlShortenerService = new UrlShortenerServiceImpl();

    Sinon.stub(
      urlShortenerService,
      'ensureAliasDoesNotExist' as any
    ).resolves();
    Sinon.stub(UrlDaoImpl.prototype, 'insert').resolves();

    await urlShortenerService.shortenUrl(url, alias);
  });
});
