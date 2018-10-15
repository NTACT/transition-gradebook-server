const path = require('path');
const Rapid = require('@simplej/rapid');
const nodeFetch = require('node-fetch');

const userCredentials = {
  username: 'user@test.com',
  password: 'password',
  newPassword: 'newPassword',
};
const adminCredentials = {
  username: 'admin@test.com',
  password: 'password',
};

const credentials = { user: userCredentials, admin: adminCredentials };

const rapidTestWrapper = Rapid.test(() =>
  new Rapid(path.join(__dirname, '..'))
    .clear()
    .migrate()
    .seed()
    .autoload()
);

async function rapidTest(description, testFn) {
  rapidTestWrapper(description, async rapid => {
    const { axios } = rapid;
    rapid.auth = async (credentials=userCredentials) => {
      const response = await axios.post('/api/login', credentials);
      return {headers: { 'Authorization': response.data.authToken } };
    };

    return testFn(rapid);
  });
}

async function createStudent(rapid, fields={}, credentials=userCredentials) {
  const { schoolYearId=1, ...rest } = fields;
  const response = await shouldSucceed(rapid.axios.post(`/api/schoolYears/${schoolYearId}/students`, {
    studentId: 'test-' + (Math.random() * 1000000),
    firstName: 'first',
    lastName: 'last',
    gender: 'female',
    birthday: '1995-03-12T01:00:00.000Z',
    gradeLevel: '9',
    disabilities: [1, 2],
    ell: false,
    ...rest,
  }, await rapid.auth(credentials)));
  return response.data.studentTermInfos[0].student;
}

async function createSchoolYear(rapid, fields={}, credentials=adminCredentials) {
  const year = 2030 + Math.floor(Math.random() * 500);
  const response = await shouldSucceed(rapid.axios.post('/api/schoolYears', {
    termType: 'annual',
    year: year,
    terms: [
      {startDate: `${year}-05-21T20:48:23.485Z`}
    ],
    students: [],
    ...fields
  }, await rapid.auth(credentials)));

  return response.data.schoolYear;
}

async function shouldSucceed(response) {
  response = await response;
  if(response.status >= 400) throw new Error(`${response.status} - ${JSON.stringify(response.data)}`);
  return response;
}

module.exports = {
  rapidTest,
  shouldSucceed,
  credentials,
  createStudent,
  createSchoolYear,
};