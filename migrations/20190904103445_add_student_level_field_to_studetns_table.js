exports.up = async knex => {
  if(await knex.schema.hasColumn('students', 'plan504')) return;

  await knex.schema.alterTable('students', async table => {
    table.boolean('plan504');
  });
};

exports.down = async knex => {
  if(!await knex.schema.hasColumn('students', 'plan504')) return;
  await knex.schema.alterTable('students', async table => {
    table.dropColumn('plan504');
  });
};