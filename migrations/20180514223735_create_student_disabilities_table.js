
exports.up = async knex => {
  if(await knex.schema.hasTable('student_disabilities')) return;
  return knex.schema.createTable('student_disabilities', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('student_id').references('id').inTable('students').onDelete('CASCADE').notNullable();
    table.integer('disability_id').references('id').inTable('disabilities').onDelete('CASCADE').notNullable();
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('student_disabilities')) {
    return knex.schema.dropTable('student_disabilities');
  }
};
