jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('disabilities', () => {
  rapidTest('GET /api/disabilities should respond with an array of disability objects', async rapid => {
    const response = await rapid.axios.get('/api/disabilities', await rapid.auth());
    await shouldSucceed(response);
    expect(response.data.disabilities).toBeTruthy();
    expect(response.data.disabilities.length).toBeGreaterThan(0);
  });
});