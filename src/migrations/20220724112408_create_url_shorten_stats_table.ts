import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('url_shorten_stats', function (table) {
    table.string('original_url', 16).primary();
    table.timestamp('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('url_shorten_stats');
}
