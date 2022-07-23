import { Model } from 'objection';
import { MAX_URL_STORAGE_DURATION } from '../../../constants';

export class Url extends Model {
  shortUrl!: string;
  originalUrl!: string;

  createdAt!: Date;
  expireAt!: Date;

  static get tableName() {
    return 'url';
  }

  static get idColumn() {
    return 'shortUrl';
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;

    if (!this.expireAt) {
      this.expireAt = new Date(now.getTime() + MAX_URL_STORAGE_DURATION);
    }
  }

  // delete expired url
  // https://vincit.github.io/objection.js/api/model/instance-methods.html#afterfind

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['shortUrl', 'originalUrl'],
      properties: {
        shortUrl: { type: 'string' },
        originalUrl: { type: 'string' },
        createdAt: { type: 'date' },
        expireAt: { type: 'date' },
      },
    };
  }
}
