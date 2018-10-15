const { termTypes } = require('../enums');

exports.up = async knex => {
  if(await knex.schema.hasTable('school_years')) return;
  return knex.schema.createTable('school_years', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('year').notNullable().unique();
    table.enu('term_type', termTypes).notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('school_years')) {
    return knex.schema.dropTable('school_years');
  }
};
