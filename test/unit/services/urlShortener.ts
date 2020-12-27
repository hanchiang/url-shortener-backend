import { expect } from 'chai';
import { UrlShortenerServiceImpl } from '../../../src/services/impl/urlShortener';

describe('UrlShortenerService unit tests', () => {
  it('Should shorten url with alias if it does not already exist', async () => {
    const url = 'abc';
    const urlShortenerService = new UrlShortenerServiceImpl();
    await urlShortenerService.shortenUrl(url);
  });
});
