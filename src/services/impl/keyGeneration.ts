import crypto from 'crypto';
import { KeyGeneration } from '../keyGeneration';
import { urlSafe } from '../../utils/urlSafe';

export class KeyGenerationServiceImpl implements KeyGeneration {
  public static readonly NUM_KEYS_TO_GENERATE = 50;
  public static readonly KEY_LENGTH = 6;

  public generate(
    num: number = KeyGenerationServiceImpl.NUM_KEYS_TO_GENERATE
  ): string[] {
    const keys = [];
    for (let i = 0; i < num; i++) {
      const key = urlSafe(this.generateBase64()).slice(
        0,
        KeyGenerationServiceImpl.KEY_LENGTH
      );
      keys.push(key);
    }
    return keys;
  }

  private generateBase64(numBytes: number = 5): string {
    return crypto.randomBytes(numBytes).toString('base64');
  }
}
