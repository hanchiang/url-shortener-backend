import { raw } from 'objection';
import { Url } from '../models/url';

export interface UrlDao {
  healthCheck(): Promise<any>;
  insert(shortUrl: string, originalUrl: string, expireAt?: Date): Promise<void>;
  findById(shortUrl: string): Promise<Url>;
  findByIds(shortUrls: string[]): Promise<Url[]>;
  findByOriginalUrl(originalUrl: string): Promise<Url[]>;
}

export class UrlDaoImpl implements UrlDao {
  public async healthCheck(): Promise<any> {
    return Url.query().select(raw('1'));
  }
  public async insert(shortUrl: string, originalUrl, expireAt): Promise<void> {
    await Url.query().insert({
      shortUrl,
      originalUrl,
      expireAt,
    });
  }

  public async findById(shortUrl: string): Promise<Url> {
    return Url.query().findById(shortUrl);
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
