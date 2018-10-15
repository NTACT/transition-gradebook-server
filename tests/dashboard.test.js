jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;

describe('dashboard', () => {
  rapidTest('Should require authentication', async rapid => {
    const response = await rapid.axios.get('/api/dashboard/1');
    expect(response.status).toEqual(401);
  });

  rapidTest('Should succeed if passed a valid term id and an auth token', async rapid => {
    const response = await rapid.axios.get('/api/dashboard/1', await rapid.auth());
    await shouldSucceed(response);
  });

  rapidTest('Should respond with a result for each activity type group', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;

    const activityTypeGroups = await rapid.models.ActivityTypeGroup.query();

    expect(result.activityGroups.length).toEqual(activityTypeGroups.length);
  });

  rapidTest('Should respond with the number of non-post-school students in the term', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;

    const expectedStudents = await rapid.models.StudentTermInfo.query()
      .where('termId', termId)
      .andWhere('gradeLevel', '!=', 'Post-school');

    expect(result.students.length).toEqual(expectedStudents.length);
  });

  rapidTest('Should respond with students grouped by activity group types they have activities in for that year', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;
    const term = await rapid.models.Term.query().where('id', termId).eager('studentTermInfos(inSchool)', {
      inSchool: query => query.where('gradeLevel', '!=', 'Post-school')
    }).first();
    const studentIds = term.studentTermInfos.map(termInfo => termInfo.studentId);

    const expected = await rapid.models.ActivityTypeGroup.query()
      .eager('[activityTypes.activities(inCurrentYear)]', {
        inCurrentYear(query) { return query.whereIn('studentId', studentIds).andWhere('schoolYearId', term.schoolYearId); }
      })
      .map(group => {
        const activities = group.activityTypes.reduce((r, t) => [...r, ...t.activities], []);
        return {group, activities};
      });

    for(let { group, activities } of expected) {
      expect(
        result.activityGroups.find(r => r.id === group.id).activityCount
      ).toEqual(activities.length);
    }
  });

  rapidTest('Should respond with off track students', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;

    expect(result.offTrackStudents).toBeTruthy();
    for(let studentId of result.offTrackStudents) {
      const termInfo = await rapid.models.StudentTermInfo.query().where('studentId', studentId).andWhere('termId', termId);
      expect(termInfo.onTrack).toBeFalsy();
    }
  });

  rapidTest('Should respond with chronically absent', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;

    expect(result.chronicAbsentStudents).toBeTruthy();
    for(let studentId of result.chronicAbsentStudents) {
      const termInfo = await rapid.models.StudentTermInfo.query()
        .where('studentId', studentId)
        .andWhere('termId', termId)
        .first();
      expect(termInfo.absentPercent >= 10).toBeTruthy();
    }
  });

  rapidTest('Should respond with a student array for each grade level (excluding post-school students)', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;

    expect(result.studentGradeGroups).toBeTruthy();
  });

  rapidTest('Should respond with an array of students for each intervention type', async rapid => {
    const termId = 1;
    const response = await rapid.axios.get(`/api/dashboard/${termId}`, await rapid.auth());
    const result = response.data;
    const { interventionGroups } = result;

    expect(interventionGroups).toBeTruthy();
    expect(interventionGroups.length).toEqual(5);
    expect(interventionGroups.map(g => g.name).sort()).toEqual([
      'attendance',
      'behavior',
      'engagement',
      'english',
      'math',
    ]);
    for(let { name, students } of interventionGroups) {
      expect(typeof name).toEqual('string');
      expect(Array.isArray(students)).toBeTruthy();
    }
  });
});