import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('url_redirect_stats', function (table) {
      table.dropPrimary();
      table.uuid('id').primary();
    })
    .alterTable('url_shorten_stats', function (table) {
      table.dropPrimary();
      table.uuid('id').primary();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('url_redirect_stats', function (table) {
      table.dropColumn('id');
      table.primary(['hash']);
    })
    .alterTable('url_shorten_stats', function (table) {
      table.dropColumn('id');
      table.primary(['original_url']);
    });
}
