exports.up = async knex => {
  if (await knex.schema.hasTable('reset_password_requests')) return;
  return knex.schema.createTable('reset_password_requests', table => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.integer('userId').references('id').inTable('users').notNullable().unique();
    table.string('uid').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('reset_password_requests')) {
    return knex.schema.dropTable('reset_password_requests');
  }
};
