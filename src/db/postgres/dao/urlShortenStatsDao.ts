import { raw } from 'objection';
import { UrlShortenStats } from '../models/UrlShortenStats';

export interface UrlShortenStatsDao {
  healthCheck(): Promise<any>;
  insert(originalUrl: string, alias?: string): Promise<void>;
}

export class UrlShortenStatsDaoImpl implements UrlShortenStatsDao {
  public async healthCheck(): Promise<any> {
    return UrlShortenStats.query().select(raw('1'));
  }
  public async insert(originalUrl: string, alias?: string): Promise<void> {
    await UrlShortenStats.query().insert({
      originalUrl,
      alias,
    });
  }
}
