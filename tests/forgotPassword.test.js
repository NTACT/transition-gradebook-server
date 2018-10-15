jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('forgot password', () => {
  rapidTest('POST /api/forgotPassword should return ok (with valid user)', async rapid => {
    const response = await rapid.axios.post('/api/forgotPassword', {
      username: testUtils.credentials.user.username,
    });
    await shouldSucceed(response);
  });

  rapidTest('GET /api/checkResetPasswordRequest should return ok (with valid UID)', async rapid => {
    const forgotPasswordResponse = await rapid.axios.post(`/api/forgotPassword`, {
      username: testUtils.credentials.user.username,
    });
    const { uid } = forgotPasswordResponse.data;

    const response = await rapid.axios.get(`/api/checkResetPasswordRequest?uid=${uid}`);
    await shouldSucceed(response);
    const { valid } = response.data;
    expect(valid).toEqual(true);
  });

  rapidTest('POST /api/resetPassword should return ok (with valid UID and password)', async rapid => {
    const forgotPasswordResponse = await rapid.axios.post(`/api/forgotPassword`, {
      username: testUtils.credentials.user.username,
    });
    const { uid } = forgotPasswordResponse.data;

    const response = await rapid.axios.post(`/api/resetPassword`, {
      uid: uid,
      password: testUtils.credentials.user.newPassword,
    });
    const { data } = response;
    const { valid } = data;
    await shouldSucceed(response);
    expect(valid).toEqual(true);
  });

});
