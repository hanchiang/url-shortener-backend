import { raw } from 'objection';
import { UrlRedirectStats } from '../models/urlRedirectStats';

export interface UrlRedirectStatsDao {
  healthCheck(): Promise<any>;
  insert(hash: string): Promise<void>;
}

export class UrlRedirectStatsDaoImpl implements UrlRedirectStatsDao {
  public async healthCheck(): Promise<any> {
    return UrlRedirectStats.query().select(raw('1'));
  }
  public async insert(hash: string): Promise<void> {
    await UrlRedirectStats.query().insert({
      hash,
    });
  }
}
