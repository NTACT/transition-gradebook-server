jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('School Settings', () => {
  rapidTest('Users should be able to fetch school settings', async rapid => {
    const response = await rapid.axios.get('/api/schoolSettings', await rapid.auth());
    await testUtils.shouldSucceed(response);
    const result = response.data;
    expect(result.schoolSettings).toBeTruthy();
  });

  rapidTest('Users should be able to update school settings', async rapid => {
    const response = await rapid.axios.post('/api/schoolSettings', {
      name: 'New name',
      gradeConversions: [
        {percent: 100, letter: 'D+', gpa: 3},
        {percent: 50, letter: 'D', gpa: 2},
        {percent: 25, letter: 'D-', gpa: 1},
      ]
    }, await rapid.auth());
    await testUtils.shouldSucceed(response);
    const result = response.data;
    expect(result.schoolSettings).toBeTruthy();
    expect(result.schoolSettings.name).toEqual('New name');
    expect(result.schoolSettings.gradeConversions.length).toEqual(3);
  });

  rapidTest('Guests should not be able to edit school settings', async rapid => {
    const response = await rapid.axios.post('/api/schoolSettings', {
      name: 'New name',
      gradeConversions: [
        {percent: 100, letter: 'D+', gpa: 3},
        {percent: 50, letter: 'D', gpa: 2},
        {percent: 25, letter: 'D-', gpa: 1},
      ]
    });
    expect(response.status).toEqual(401);
  })
});
