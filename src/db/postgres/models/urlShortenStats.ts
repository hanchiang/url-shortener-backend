import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';

export class UrlShortenStats extends Model {
  id!: string;
  originalUrl!: string;
  alias?: string;

  createdAt!: Date;

  static get tableName() {
    return 'url_shorten_stats';
  }

  static get idColumn() {
    return 'id';
  }

  $beforeInsert() {
    this.id = uuidv4();
    this.createdAt = new Date();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['originalUrl'],
      properties: {
        id: { type: 'string' },
        originalUrl: { type: 'string' },
        alias: { type: 'string' },
        createdAt: { type: 'date-time' },
      },
    };
  }
}
