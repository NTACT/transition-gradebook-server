exports.up = async knex => {
    if(await knex.schema.hasColumn('student_term_info', 'post_school_goals')) return;
  
    await knex.schema.alterTable('student_term_info', async table => {
      table.string('post_school_goals');
    });
  };
  
  exports.down = async knex => {
    if(!await knex.schema.hasColumn('student_term_info', 'post_school_goals')) return;
    await knex.schema.alterTable('student_term_info', async table => {
      table.dropColumn('post_school_goals');
    });
  };