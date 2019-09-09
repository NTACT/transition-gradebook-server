exports.up = async knex => {
  if(await knex.schema.hasColumn('users', 'latest_version')) return;

  await knex.schema.alterTable('users', async table => {
    table.text('latest_version');
  });
};

exports.down = async knex => {
  if(!await knex.schema.hasColumn('users', 'latest_version')) return;
  await knex.schema.alterTable('users', async table => {
    table.dropColumn('latest_version');
  });
};