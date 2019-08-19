jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('Activities', () => {

  rapidTest(`Users should be able to GET a student's activities through /activities/:studentId/:schoolYearId`, async rapid => {
    const response = await rapid.axios.get('/api/activities/1/1', await rapid.auth());
    expect(response.status).toEqual(200);
    const { activities } = response.data;
    expect(activities).toBeTruthy();
  });

  rapidTest(`Users should be able to POST new student activities through /activities`, async rapid => {
    const response = await rapid.axios.post('/api/activities', {
      studentIds: [1],
      schoolYearId: 1,
      activityTypeId: 1,
      notes: 'Some notes!',
      frequency: 'Daily',
      events: [
        { eventTime: new Date() },
        { eventTime: new Date() },
        { eventTime: new Date() },
      ]
    }, await rapid.auth());
    await shouldSucceed(response);
  });

  rapidTest('Users should be able to POST multiple student IDs to /activities to create multiple activities.', async rapid => {
    const response = await rapid.axios.post('/api/activities', {
      studentIds: [1, 2, 3],
      schoolYearId: 1,
      activityTypeId: 1,
      notes: 'Some notes, given to multiple students!',
      frequency: 'Daily',
      events: [
        { eventTime: new Date() }
      ]
    }, await rapid.auth());
    await shouldSucceed(response);
    expect(response.data.activities.length).toEqual(3)
  })

  rapidTest('Users should be able to POST student activity changes through /activities/:studentId/:schoolYearId/:activityId', async rapid => {
    // Create activity
    await rapid.axios.post('/api/activities/1/1', {
      activityTypeId: 1,
      notes: 'Some notes!',
      frequency: 'Daily',
      events: [
        { eventTime: new Date() },
        { eventTime: new Date() },
        { eventTime: new Date() },
      ]
    }, await rapid.auth());

    // Update activity
    const response = await rapid.axios.post('/api/activities/1/1/1', {
      activityTypeId: 1,
      notes: 'Edited notes',
      frequency: 'Daily',
      events: [
        { eventTime: new Date() },
      ]
    }, await rapid.auth());

    await shouldSucceed(response);

    const { activity } = await response.data;
    expect(activity).toBeTruthy();

    const editedActivity = await rapid.models.Activity.query().first().where('id', activity.id).eager('[events]');

    expect(editedActivity.notes).toEqual('Edited notes');
    expect(editedActivity.events.length).toEqual(1);
  });

  rapidTest('Users should be able to DELETE activities through /activities/:activityId', async rapid => {
    const response = await rapid.axios.delete('/api/activities/2', await rapid.auth());
    await shouldSucceed(response);
  });

  rapidTest(`Non-users shouldn't be able to access activity endpoints`, async rapid => {
    const getResponse = await rapid.axios.get('/api/activities/1/1');
    const createResponse = await rapid.axios.post('/api/activities', {
      activityTypeId: 1,
      notes: 'Some notes!',
    });
    const editResponse = await rapid.axios.post('/api/activities/1/1/1', {
      activityTypeId: 1,
      notes: 'Edited notes',
    });
    const deleteResponse = await rapid.axios.delete('/api/activities/1');

    expect(getResponse.status).toEqual(401);
    expect(createResponse.status).toEqual(401);
    expect(editResponse.status).toEqual(401);
    expect(deleteResponse.status).toEqual(401);
  });

});
