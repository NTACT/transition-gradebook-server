const enums = require('../enums');

exports.up = async knex => {
  if(await knex.schema.hasTable('student_term_info')) return;
  return knex.schema.createTable('student_term_info', table => {
    table.increments('id').primary();
    table.timestamps(true, true);

    table.integer('student_id').references('id').inTable('students').notNullable();
    table.integer('term_id').references('id').inTable('terms').notNullable();
    
    table.enu('grade_type', enums.gradeTypes).defaultTo(enums.gradeTypes[0]);
    table.string('grade');

    table.enu('grade_level', enums.grades).notNullable();
    table.string('exit_category');
    table.string('post_school_outcome');

    // Risk factors
    table.float('absent_percent');
    table.integer('behavior_marks');
    table.boolean('suspended');
    table.boolean('failing_english');
    table.boolean('failing_math');
    table.boolean('failing_other');
    table.boolean('on_track');
    table.boolean('retained');
    table.integer('schools_attended');
    table.boolean('has_extracurricular');

    // Skills
    table.boolean('has_self_determination_skills');
    table.boolean('has_independent_living_skills');
    table.boolean('has_travel_skills');
    table.boolean('has_social_skills');

    // Career dev + IEP
    table.boolean('attended_iep_meeting');
    table.enu('iep_role', enums.iepRoles);
    table.boolean('has_graduation_plan');
  });
};

exports.down = async knex => {
  if(await knex.schema.hasTable('student_term_info')) {
    return knex.schema.dropTable('student_term_info');
  }
};
