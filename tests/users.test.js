jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('students', () => {
  rapidTest('POST /api/login should respond with a JWT and user when credentials are correct', async rapid => {
    const credentials = testUtils.credentials.user;
    const response = await rapid.axios.post('/api/login', credentials);
    await shouldSucceed(response);

    const { data } = response;
    expect(data.authToken).toBeTruthy();
    expect(data.user).toBeTruthy();
  });

  rapidTest('Admins should be able to create users', async rapid => {
    const response = await rapid.axios.post('/api/users', {
      firstName: 'create',
      lastName: 'test',
      email: 'adminCreateTest@test.com',
      password: 'password123',
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));

    await shouldSucceed(response);
    expect(await rapid.models.User.query().where('email', 'adminCreateTest@test.com').first()).toBeTruthy();
  });

  rapidTest('Users shouldn\'t be able to create users', async rapid => {
    const response = await rapid.axios.post('/api/users', {
      firstName: 'create',
      lastName: 'test',
      email: 'userCreateTest@test.com',
      password: 'password123',
      admin: false,
    }, await rapid.auth());

    expect(response.status).toEqual(401);
  });

  rapidTest('Admins should be able to delete users', async rapid => {
    const createResponse = await rapid.axios.post('/api/users', {
      firstName: 'delete',
      lastName: 'test',
      email: 'adminDeleteTest@test.com',
      password: 'password123',
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));
    const { user } = createResponse.data;

    const deleteResponse = await rapid.axios.delete(`/api/users/${user.id}`, await rapid.auth(testUtils.credentials.admin));
    await shouldSucceed(deleteResponse);

    expect(await rapid.models.User.query().where('email', 'adminDeleteTest@test.com').first()).toBeFalsy();
  });

  rapidTest('Users shouldn\'t be able to delete users', async rapid => {
    const deleteResponse = await rapid.axios.delete('/api/users/1', await rapid.auth());
    expect(deleteResponse.ok).toBeFalsy();
  });

  rapidTest('Admins should be able to edit users', async rapid => {
    const createResponse = await rapid.axios.post('/api/users', {
      firstName: 'edit',
      lastName: 'test',
      email: 'adminEditTest@test.com',
      password: 'password123',
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));
    const { user } = createResponse.data;

    await rapid.axios.post(`/api/users/${user.id}`, {
      firstName: 'edited',
      lastName: 'lastNameEdited',
      email: 'editSuccess@test.com',
      admin: true,
    }, await rapid.auth(testUtils.credentials.admin));
    
    const editedUser = await rapid.models.User.query().where('email', 'editSuccess@test.com').first();
    expect(editedUser.firstName).toEqual('edited');
    expect(editedUser.lastName).toEqual('lastNameEdited');
    expect(editedUser.email).toEqual('editSuccess@test.com');
    expect(editedUser.admin).toEqual(true);
  });

  rapidTest('Users shouldn\'t be able to edit other users', async rapid => {
    const createResponse = await rapid.axios.post('/api/users', {
      firstName: 'edit',
      lastName: 'test',
      email: 'userEditTest@test.com',
      password: 'password123',
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));
    const { user } = createResponse.data;

    const editResponse = await rapid.axios.post(`/api/users/${user.id}`, {
      firstName: 'edited',
      lastName: 'lastNameEdited',
      email: 'userEditSuccess@test.com',
      admin: true,
    }, await rapid.auth(testUtils.credentials.user));
    expect(editResponse.ok).toBeFalsy();
  });

  rapidTest('Users should be able to edit themselves', async rapid => {
    const username = 'userEditSelfTest@test.com';
    const password = 'password123';
    const createResponse = await rapid.axios.post('/api/users', {
      firstName: 'edit',
      lastName: 'test',
      email: username,
      password: password,
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));
    const { user } = createResponse.data;

    const editResponse = await rapid.axios.post(`/api/users/${user.id}`, {
      firstName: 'success',
      lastName: 'edited',
    }, await rapid.auth({username, password}));
    await shouldSucceed(editResponse);
  });

  rapidTest('Users shouldn\'t be able to change their admin status', async rapid => {
    const username = 'userEditAdminTest@test.com';
    const password = 'password123';
    const createResponse = await rapid.axios.post('/api/users', {
      firstName: 'edit',
      lastName: 'test',
      email: username,
      password: password,
      admin: false,
    }, await rapid.auth(testUtils.credentials.admin));
    const { user } = createResponse.data;

    await rapid.axios.post(`/api/users/${user.id}`, {
      admin: true
    }, await rapid.auth({username, password}));

    const editedUser = await rapid.models.User.query().where('email', username).first();
    expect(editedUser).toBeTruthy();
    expect(editedUser.admin).toEqual(false);
  });
});