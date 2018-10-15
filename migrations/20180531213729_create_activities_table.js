const enums = require('../enums');

exports.up = async knex => {
  if(await knex.schema.hasTable('activities')) return;
  return knex.schema.createTable('activities', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('student_id').references('id').inTable('students').onDelete('CASCADE').notNullable();
    table.integer('school_year_id').references('id').inTable('school_years').onDelete('CASCADE').notNullable();
    table.integer('activity_type_id').references('id').inTable('activity_types').notNullable();
    table.enu('frequency', enums.activityFrequencies).notNullable();

    table.text('notes').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('activities')) {
    return knex.schema.dropTable('activities');
  }
};
