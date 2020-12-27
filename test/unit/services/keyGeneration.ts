import { expect } from 'chai';
import { KeyGenerationServiceImpl } from '../../../src/services/impl/keyGeneration';

describe('KeyGenerationService unit tests', () => {
  it('Should generate keys with specified length', () => {
    const keyGenerationService = new KeyGenerationServiceImpl();
    const keys = keyGenerationService.generate();
    expect(keys.length).equal(KeyGenerationServiceImpl.NUM_KEYS_TO_GENERATE);
    for (const key of keys) {
      expect(key.length).equal(KeyGenerationServiceImpl.KEY_LENGTH);
    }
  });
});
