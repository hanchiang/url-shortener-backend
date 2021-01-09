import { expect } from 'chai';
import { UrlShortenerServiceImpl } from '../../../src/services/impl/urlShortener';
import { ErrorCode } from '../../../src/utils/error';

describe('UrlShortenerService unit tests', () => {
  it('Should shorten url with alias if it does not already exist', async () => {
    const url = 'www.google.com';
    const alias = 'abc';
    const urlShortenerService = new UrlShortenerServiceImpl();
    await urlShortenerService.shortenUrl(url, alias);
  });

  it('Should throw error if alias already exist', async () => {
    const url = 'www.google.com';
    const alias = 'abc';
    const urlShortenerService = new UrlShortenerServiceImpl();
    await urlShortenerService.shortenUrl(url, alias);

    let error;
    try {
      await urlShortenerService.shortenUrl(url, alias);
    } catch (e) {
      error = e;
    }
    expect(error).to.not.be.undefined;
    expect(error.status).equal(ErrorCode.CONFLICT);
    expect(error.message).equal(
      `Alias ${alias} is already taken. Please use another alias`
    );
  });
});
