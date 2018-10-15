

exports.up = async knex => {
  if(await knex.schema.hasTable('activity_events')) return;
  return knex.schema.createTable('activity_events', table => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.integer('activity_id').references('id').inTable('activities').onDelete('CASCADE').notNullable();
    table.timestamp('event_time').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('activity_events')) {
    return knex.schema.dropTable('activity_events');
  }
};
