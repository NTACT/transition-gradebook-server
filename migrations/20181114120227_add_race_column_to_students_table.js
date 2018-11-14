
exports.up = async knex => {
  if(await knex.schema.hasColumn('students', 'race')) return;

  const { races } = require('tgb-shared').enums;
  await knex.schema.alterTable('students', async table => {
    table.enu('race', races);
  });
};

exports.down = async knex => {
  if(!await knex.schema.hasColumn('students', 'race')) return;
  await knex.schema.alterTable('students', async table => {
    table.dropColumn('race');
  });
};
