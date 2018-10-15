
exports.up = async knex => {
  if(await knex.schema.hasTable('activity_types')) return;
  return knex.schema.createTable('activity_types', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('activity_type_group_id').references('id').inTable('activity_type_groups').notNullable();
    table.string('name').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('activity_types')) {
    return knex.schema.dropTable('activity_types');
  }
};
