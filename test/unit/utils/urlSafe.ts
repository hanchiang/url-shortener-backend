import { expect } from 'chai';
import { urlSafe } from '../../../src/utils/urlSafe';

describe('urlSafe unit tests', () => {
  it('should remove non-alphanumeric characters', () => {
    const str = ' AaBb !';
    const expected = 'AaBb';
    expect(urlSafe(str)).equal(expected);
  });
  it('should replace + with a random character', () => {
    const str = 'Aa+';
    const result = urlSafe(str);
    expect(result.indexOf('+')).equal(-1);
  });
  it('should replace / with a random character', () => {
    const str = 'Aa/';
    const result = urlSafe(str);
    expect(result.indexOf('/')).equal(-1);
  });
});
