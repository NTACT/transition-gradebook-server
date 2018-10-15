

exports.up = async knex => {
  if(await knex.schema.hasTable('school_settings')) return;
  return knex.schema.createTable('school_settings', table => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.text('name').notNullable();
    table.json('grade_conversions').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('school_settings')) {
    return knex.schema.dropTable('school_settings');
  }
};
