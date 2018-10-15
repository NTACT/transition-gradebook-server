
exports.up = async knex => {
  if(await knex.schema.hasTable('disabilities')) return;
  return knex.schema.createTable('disabilities', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.string('name').notNullable().unique();
    table.string('full_name').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('disabilities')) {
    return knex.schema.dropTable('disabilities');
  }
};
