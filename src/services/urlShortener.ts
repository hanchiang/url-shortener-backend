export interface UrlShortenerService {
  /**
   * @returns The shortened url
   * @param url
   * @param alias
   */
  shortenUrl(url: string, alias?: string): Promise<string>;

  /**
   * @returns The original url
   * @param urlKey
   */
  getOriginalUrl(urlKey: string): Promise<string>;
}
