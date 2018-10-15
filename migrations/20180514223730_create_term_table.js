
exports.up = async knex => {
  if(await knex.schema.hasTable('terms')) return;
  return knex.schema.createTable('terms', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('school_year_id').references('id').inTable('school_years').notNullable();
    table.integer('index').notNullable();
    table.timestamp('start_date', true);
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('terms')) {
    return knex.schema.dropTable('terms');
  }
};
