const { genders } = require('../enums');

exports.up = async knex => {
  if(await knex.schema.hasTable('students')) return;
  return knex.schema.createTable('students', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.string('student_id').notNullable().unique();
    table.boolean('ell').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.date('birthday').notNullable();
    table.enu('gender', genders).notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('students')) {
    return knex.schema.dropTable('students');
  }
};
