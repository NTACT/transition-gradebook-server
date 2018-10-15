
exports.up = async knex => {
  if(await knex.schema.hasTable('activity_type_groups')) return;
  return knex.schema.createTable('activity_type_groups', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.string('name').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('activity_type_groups')) {
    return knex.schema.dropTable('activity_type_groups');
  }
};
