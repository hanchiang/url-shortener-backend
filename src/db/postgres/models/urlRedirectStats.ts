import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';

export class UrlRedirectStats extends Model {
  id!: string;
  hash!: string;

  createdAt!: Date;

  static get tableName() {
    return 'url_redirect_stats';
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
      required: ['hash'],
      properties: {
        id: { type: 'string' },
        hash: { type: 'string' },
        createdAt: { type: 'date-time' },
      },
    };
  }
}
