export interface KeyGeneration {
  /**
   * Generate random key for shortening URLs
   * @param num
   */
  generate(num?: number): string[];
}
