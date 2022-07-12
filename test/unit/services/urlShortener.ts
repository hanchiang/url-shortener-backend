import { UrlShortenerServiceImpl } from './../../../src/services/impl/urlShortener';
import { expect } from 'chai';
import Sinon from 'sinon';

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
    Sinon.stub(UrlShortenerServiceImpl.prototype, 'getUrlKeyFromDb').resolves(
      undefined
    );
    Sinon.stub(UrlDaoImpl.prototype, 'insert').resolves();
    Sinon.stub(Redis, 'getInstance' as any).resolves();

    const urlShortenerService = UrlShortenerServiceImpl.defaultImpl();
    const shortenedUrl = await urlShortenerService.shortenUrl(url, alias);
    expect(shortenedUrl).to.eq(`http://localhost:3000/${alias}`);
  });

  it('Should get shortened URL from DB and do not insert into DB', async () => {
    const url = 'www.google.com';
    Sinon.stub(
      UrlShortenerServiceImpl.prototype,
      'ensureAliasDoesNotExist' as any
    ).resolves();
    Sinon.stub(UrlShortenerServiceImpl.prototype, 'getUrlKeyFromDb').resolves(
      'urlKey'
    );
    Sinon.stub(UrlDaoImpl.prototype, 'insert').resolves();
    Sinon.stub(Redis, 'getInstance' as any).resolves();

    const urlShortenerService = UrlShortenerServiceImpl.defaultImpl();
    const shortenedUrl = await urlShortenerService.shortenUrl(url);
    expect(shortenedUrl).to.eq(`http://localhost:3000/urlKey`);
  });
});
