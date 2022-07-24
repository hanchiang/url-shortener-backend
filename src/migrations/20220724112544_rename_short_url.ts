import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('url', function (table) {
      table.renameColumn('short_url', 'hash');
    })
    .alterTable('url_redirect_stats', function (table) {
      table.renameColumn('short_url', 'hash');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('url', function (table) {
      table.renameColumn('hash', 'short_url');
    })
    .alterTable('url_redirect_stats', function (table) {
      table.renameColumn('hash', 'short_url');
    });
}
