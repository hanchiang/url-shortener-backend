import crypto from 'crypto';
import { KeyGeneration } from '../key-generation';
import { Redis } from '../../db/redis';
import { urlSafe } from '../../utils/url-safe';

export class KeyGenerationService implements KeyGeneration {
  public static readonly NUM_KEYS_TO_GENERATE = 50;
  public static KEY_LENGTH = 6;

  public generate(
    num: number = KeyGenerationService.NUM_KEYS_TO_GENERATE
  ): string[] {
    const keys = [];
    for (let i = 0; i < num; i++) {
      const key = urlSafe(this.generateBase64()).slice(
        0,
        KeyGenerationService.KEY_LENGTH
      );
      keys.push(key);
    }
    return keys;
  }

  private generateBase64(numBytes: number = 5): string {
    return crypto.randomBytes(numBytes).toString('base64');
  }
}
