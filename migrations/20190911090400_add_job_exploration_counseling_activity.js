exports.up = async knex => {
  const activityType = await knex('activity_types')
    .where('name', 'Job Exploration Counseling (CW, Pre-ETS)')
    .first();

  if (!activityType) {
    const activityTypeGroup = await knex('activity_type_groups')
      .where('name', 'Career Awareness')
      .first();

    if (activityTypeGroup) {
      await knex('activity_types').insert({
        name: 'Job Exploration Counseling (CW, Pre-ETS)',
        activityTypeGroupId: activityTypeGroup.id
      });
    }
  }
};

exports.down = async knex => {
  await knex('activity_types')
    .where('name', 'Job Exploration Counseling (CW, Pre-ETS)')
    .delete();
};
