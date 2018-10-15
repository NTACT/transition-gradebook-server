module.exports = context => {
  const { flatten } = require('lodash');
  const { models } = context;
  const { SchoolYear, StudentTermInfo } = models;

  const termTypeCounts = {
    'annual': 1,
    'semester': 2,
    'trimester': 3,
    'quarter': 4,
  };

  class SchoolYearController {
    getSchoolYears() {
      return SchoolYear
        .query()
        .select('*')
        .eager('terms');
    }

    getSchoolYear(schoolYearId) {
      return SchoolYear
        .query()
        .select('*')
        .eager('terms.studentTermInfos.student.disabilities')
        .skipUndefined()
        .where('id', schoolYearId)
        .first();
    }

    getStudentsByTerm(termId) {
      return StudentTermInfo.query().where('termId', termId).eager('student.disabilities');
    }

    async createSchoolYear({
      year,
      termType,
      terms,
      students,
    }) {
      if(!termTypeCounts.hasOwnProperty(termType)) throw new Error(`Invalid term type "${termType}".`);
      if(termTypeCounts[termType] !== terms.length) throw new Error(`Invalid number of terms. Term type "${termType}" requires ${termTypeCounts[termType]} term${termTypeCounts[termType] !== 1 ? 's' : ''} (${terms.length} provided).`);
      
      // Create school year and terms
      const schoolYear = await SchoolYear.query().insertGraphAndFetch({
        year,
        termType,
        terms: terms
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .map((term, index) => ({...term, index})),
      });
      const createdTerms = schoolYear.terms;
      
      // Create term specific info rows for every term/student pair
      const studentTermInfos = flatten(students.map(student => {
        return createdTerms.map(term => {
          return {
            termId: term.id,
            studentId: student.id,
            gradeLevel: student.gradeLevel,
            exitCategory: student.gradeLevel === 'Post-school' ? (student.exitCategory || null) : null,
            postSchoolOutcome: student.gradeLevel === 'Post-school' ? (student.postSchoolOutcome || null) : null,
          };
        });
      }));
      await StudentTermInfo.query().insert(studentTermInfos);

      return SchoolYear.query().where('id', schoolYear.id).eager('terms.studentTermInfos.student').first();
    }

    async getCurrentSchoolYear() {
      return SchoolYear.query()
        .where('year', '<=', new Date().getFullYear())
        .orderBy('year', 'DESC')
        .first()
        .eager('[terms, students]');
    }

    async getCurrentTerm(schoolYear=this.getCurrentSchoolYear()) {
      schoolYear = await schoolYear;
      const now = new Date();
      const terms = schoolYear.terms.sort((a, b) => a.index - b.index);
      return terms.find(term => new Date(term.startDate) <= now) || terms[0];
    }
  }

  return SchoolYearController;
};
