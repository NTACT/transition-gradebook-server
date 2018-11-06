module.exports = function createSchoolSettings({ models }) {
  return models.SchoolSettings.query().insert({
    name: 'School Name',
    gradeConversions: [
      {percent: 97, letter: 'A+', gpa: 4.0},
      {percent: 93, letter: 'A', gpa: 4.0},
      {percent: 90, letter: 'A-', gpa: 3.67},
  
      {percent: 87, letter: 'B+', gpa: 3.33},
      {percent: 83, letter: 'B', gpa: 3.0},
      {percent: 80, letter: 'B-', gpa: 2.67},
  
      {percent: 77, letter: 'C+', gpa: 2.33},
      {percent: 73, letter: 'C', gpa: 2.0},
      {percent: 70, letter: 'C-', gpa: 1.67},

      {percent: 67, letter: 'D+', gpa: 1.33},
      {percent: 63, letter: 'D', gpa: 1.0},
      {percent: 60, letter: 'D-', gpa: 0.67},

      {percent: 59, letter: 'F', gpa: 0},
    ],
  });
};

module.exports.runOrder = 1;
