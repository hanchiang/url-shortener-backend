import { raw } from 'objection';
import { Url } from '../models/url';

export interface UrlDao {
  healthCheck(): Promise<any>;
  insert(hash: string, originalUrl: string, expireAt?: Date): Promise<void>;
  findById(hash: string): Promise<Url>;
  findByIds(shortUrls: string[]): Promise<Url[]>;
  findByOriginalUrl(originalUrl: string): Promise<Url[]>;
}

export class UrlDaoImpl implements UrlDao {
  public async healthCheck(): Promise<any> {
    return Url.query().select(raw('1'));
  }
  public async insert(hash: string, originalUrl, expireAt): Promise<void> {
    await Url.query().insert({
      hash,
      originalUrl,
      expireAt,
    });
  }

  public async findById(hash: string): Promise<Url> {
    return Url.query().findById(hash);
  }

  public async findByIds(shortUrls: string[]): Promise<Url[]> {
    return Url.query().findByIds(shortUrls);
  }

  public async findByOriginalUrl(originalUrl: string): Promise<Url[]> {
    return Url.query().where({
      originalUrl,
    });
  }
}
