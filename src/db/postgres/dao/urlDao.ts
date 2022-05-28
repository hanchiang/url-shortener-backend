import { Url } from '../models/url';

export interface UrlDao {
  insert(id: string, originalUrl: string): Promise<void>;
  findById(id: string): Promise<Url>;
  findByIds(ids: string[]): Promise<Url[]>;
}

export class UrlDaoImpl implements UrlDao {
  public async insert(id: string, originalUrl): Promise<void> {
    await Url.query().insert({
      id,
      originalUrl,
    });
  }

  public async findById(id: string): Promise<Url> {
    return Url.query().findById(id);
  }

  public async findByIds(ids: string[]): Promise<Url[]> {
    return Url.query().findByIds(ids);
  }
}
