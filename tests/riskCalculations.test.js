jest.setTimeout(60000);
const testUtils = require('./testUtils');
const { rapidTest, shouldSucceed } = testUtils;
const { enums, convertGradeToGpa, normalizeGpa, getGpaRange } = require('tgb-shared');
const { grades } = enums;

describe('Risk Calculations', () => {
  rapidTest('getStudentRiskDataByTerms should succeed when passed a valid term ids', async rapid => {
    await rapid.controllers.riskDataController.getStudentRiskDataByTerms([1, 2]);
  });

  rapidTest('getStudentRiskDataByTerms should return be an array of terms', async rapid => {
    const riskData = await rapid.controllers.riskDataController.getStudentRiskDataByTerms([1, 2]);
    expect(Array.isArray(riskData)).toBeTruthy();
    for(let term of riskData) expect(term).toBeTruthy();
  });

  rapidTest('Terms returned by getStudentRiskDataByTerms should contain student arrays', async rapid => {
    const riskData = await rapid.controllers.riskDataController.getStudentRiskDataByTerms([1, 2]);
    expect(Array.isArray(riskData)).toBeTruthy();
    for(let term of riskData) expect(Array.isArray(term.students)).toBeTruthy();
  });

  rapidTest('Term students returned by getStudentRiskDataByTerms should contain risk data', async rapid => {
    const riskData = await rapid.controllers.riskDataController.getStudentRiskDataByTerms([1, 2]);
    expect(Array.isArray(riskData)).toBeTruthy();
    for(let term of riskData) for(let student of term.students) {
      expect(student.riskData).toBeTruthy();
    }
  });

  rapidTest('getStudentRiskDataByTerms student risks should be either No Data, low, medium, high, or ultra', async rapid => {
    const riskData = await rapid.controllers.riskDataController.getStudentRiskDataByTerms([1, 2]);
    expect(Array.isArray(riskData)).toBeTruthy();
    for(let term of riskData) for(let student of term.students) {
      for(let riskLevel of Object.values(student.riskData)) {
        expect(['No Data', 'low', 'medium', 'high', 'ultra'].includes(riskLevel)).toBeTruthy()
      }
    }
  });

  rapidTest('normalizeGpa should convert a non-standard gpa to a 0-4 gpa', rapid => {
    expect(normalizeGpa([5, 10], 5)).toEqual(0);
    expect(normalizeGpa([5, 10], 7.5)).toEqual(2);
    expect(normalizeGpa([50, 100], 80)).toEqual(2.4);
    expect(normalizeGpa([500, 1000], 1000)).toEqual(4);
  });

  rapidTest('convertGradeToGpa should convert letter grades to the correct gpa', async rapid => {
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    expect(schoolSettings).toBeTruthy();

    expect(convertGradeToGpa(schoolSettings, 'letter', 'A+')).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'A',)).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'A-')).toEqual(3.67);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'B+')).toEqual(3.33);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'B',)).toEqual(3.0);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'B-')).toEqual(2.67);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'C+')).toEqual(2.33);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'C',)).toEqual(2.0);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'C-')).toEqual(1.67);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'D+')).toEqual(1.33);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'D',)).toEqual(1.0);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'D-')).toEqual(0.67);
    expect(convertGradeToGpa(schoolSettings, 'letter', 'F',)).toEqual(0);
  });

  rapidTest('convertGradeToGpa should convert percent grades to the correct gpa', async rapid => {
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    expect(schoolSettings).toBeTruthy();

    expect(convertGradeToGpa(schoolSettings, 'percent', 97)).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'percent', 93)).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'percent', 90)).toEqual(3.67);
    expect(convertGradeToGpa(schoolSettings, 'percent', 87)).toEqual(3.33);
    expect(convertGradeToGpa(schoolSettings, 'percent', 83)).toEqual(3.0);
    expect(convertGradeToGpa(schoolSettings, 'percent', 80)).toEqual(2.67);
    expect(convertGradeToGpa(schoolSettings, 'percent', 77)).toEqual(2.33);
    expect(convertGradeToGpa(schoolSettings, 'percent', 73)).toEqual(2.0);
    expect(convertGradeToGpa(schoolSettings, 'percent', 70)).toEqual(1.67);
    expect(convertGradeToGpa(schoolSettings, 'percent', 67)).toEqual(1.33);
    expect(convertGradeToGpa(schoolSettings, 'percent', 63)).toEqual(1.0);
    expect(convertGradeToGpa(schoolSettings, 'percent', 60)).toEqual(0.67);
    expect(convertGradeToGpa(schoolSettings, 'percent', 59)).toEqual(0);
  });

  rapidTest('convertGradeToGpa should return gpa values as-is', async rapid => {
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    expect(schoolSettings).toBeTruthy();

    expect(convertGradeToGpa(schoolSettings, 'gpa', 4.0)).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 4.0)).toEqual(4.0);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 3.67)).toEqual(3.67);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 3.33)).toEqual(3.33);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 3.0)).toEqual(3.0);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 2.67)).toEqual(2.67);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 2.33)).toEqual(2.33);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 2.0)).toEqual(2.0);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 1.67)).toEqual(1.67);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 1.33)).toEqual(1.33);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 1.0)).toEqual(1.0);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 0.67)).toEqual(0.67);
    expect(convertGradeToGpa(schoolSettings, 'gpa', 0)).toEqual(0);
  });

  rapidTest('calcOverallRisk should return ultra if any risks are ultra', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'high',
      d: 'ultra',
      e: 'high',
      f: 'high',
    });
    expect(risk).toEqual('ultra');
  });

  rapidTest('calcOverallRisk should increase high risks by 1 if mediums are 2', rapid => {
    const risk1 = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
    });
    expect(risk1).toEqual('high');

    const risk2 = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
      e: 'medium',
    });
    expect(risk2).toEqual('ultra');

    const risk3 = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
      e: 'high',
    });
    expect(risk3).toEqual('ultra');
  });

  rapidTest('calcOverallRisk should return ultra if three or more risks are medium', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
      e: 'medium',
      f: 'high',
    });
    expect(risk).toEqual('ultra');
  });

  rapidTest('calcOverallRisk should return ultra if two or more risks are high', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
      e: 'high',
      f: 'high',
    });
    expect(risk).toEqual('ultra');
  });

  rapidTest('calcOverallRisk should return high if two risks are medium', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
      d: 'medium',
    });
    expect(risk).toEqual('high');
  });

  rapidTest('calcOverallRisk should return medium if highest risk is medium and there is only 1 medium', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
      c: 'medium',
    });
    expect(risk).toEqual('medium');
  });

  rapidTest('calcOverallRisk should return low if highest risk is low', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'low',
      b: 'low',
    });
    expect(risk).toEqual('low');
  });

  rapidTest('calcOverallRisk should return "No Data" if there are no valid risk levels', rapid => {
    const risk = rapid.controllers.riskDataController.calcOverallRisk({
      a: 'No Data',
    });
    expect(risk).toEqual('No Data');

    const risk2 = rapid.controllers.riskDataController.calcOverallRisk({});
    expect(risk2).toEqual('No Data');
  });

  rapidTest('getGpaRange should return the min and max GPAs in a school settings object', async rapid => {
    const schoolSettings = await rapid.controllers.schoolSettingsController.getSchoolSettings();
    expect(schoolSettings).toBeTruthy();
    expect(getGpaRange(schoolSettings)).toEqual([0, 4]);
  });
  
  // Intervention

  rapidTest(`Student should require attendance intervention if they're absent 6-9% of the time`, rapid => {
    for(let absentPercent = 0; absentPercent <= 100; absentPercent++) {
      const interventions = rapid.controllers.riskDataController.calcInterventions({
        absentPercent: absentPercent
      }, 4);
      if(absentPercent >= 6) {
        expect(interventions.attendance).toBeTruthy();
      } else {
        expect(interventions.attendance).toBeFalsy();
      }
    }
  });

  rapidTest(`Students should require behavior intervention if they're ever suspended or receive any referrals`, rapid => {
    const interventions1 = rapid.controllers.riskDataController.calcInterventions({
      suspended: true,
      behaviorMarks: 0,
    }, 4);
    expect(interventions1.behavior).toBeTruthy();
    const interventions2 = rapid.controllers.riskDataController.calcInterventions({
      suspended: false,
      behaviorMarks: 1,
    }, 4);
    expect(interventions2.behavior).toBeTruthy();
    const interventions3 = rapid.controllers.riskDataController.calcInterventions({
      suspended: true,
      behaviorMarks: 1,
    }, 4);
    expect(interventions3.behavior).toBeTruthy();
  });

  rapidTest(`Student shouldn't require engagement intervention if absent <6% or >9% and attended <4 schools and gpa >= 2.5 and is on track and isn't failing any course`, rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      onTrack: true,
      schoolsAttended: 1,
      absentPercent: 0,
      failingEnglish: false,
      failingMath: false,
      failingOther: false,
    }, 4);

    expect(interventions.engagement).toBeFalsy();
  });

  rapidTest('Student should require engagement intervention if their absent 6% or more of the time', rapid => {
    for(let absentPercent = 0; absentPercent <= 100; absentPercent++) {
      const interventions = rapid.controllers.riskDataController.calcInterventions({
        absentPercent,
        schoolsAttended: 1,
        onTrack: true,
      }, 4);
      if(absentPercent >= 6) {
        expect(interventions.engagement).toBeTruthy();
      } else {
        expect(interventions.engagement).toBeFalsy();
      }
    }
  });

  rapidTest('Student should require engagement intervention if they attended 4+ schools', rapid => {
    for(let schoolsAttended = 1; schoolsAttended <= 10; schoolsAttended++) {
      const interventions = rapid.controllers.riskDataController.calcInterventions({
        schoolsAttended,
        absentPercent: 0,
        onTrack: true,
      }, 4);
      if(schoolsAttended >= 4) {
        expect(interventions.engagement).toBeTruthy();
      } else {
        expect(interventions.engagement).toBeFalsy();
      }
    }
  });

  rapidTest('Student should require engagement intervention if their gpa is under 2.5', rapid => {
    for(let gpa = 0; gpa <= 4; gpa += 0.1) {
      const interventions = rapid.controllers.riskDataController.calcInterventions({
        schoolsAttended: 1,
        absentPercent: 0,
        onTrack: true,
      }, gpa);
      if(gpa < 2.5) {
        expect(interventions.engagement).toBeTruthy();
      } else {
        expect(interventions.engagement).toBeFalsy();
      }
    }
  });

  rapidTest('Student should require engagement intervention if they are off-track for their grade', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      onTrack: false,
      schoolsAttended: 1,
      absentPercent: 0,
    }, 4);

    expect(interventions.engagement).toBeTruthy();
  });

  rapidTest('Student should require engagement intervention if they are failing english', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingEnglish: true,
      onTrack: true,
      schoolsAttended: 1,
      absentPercent: 0,
    }, 4);

    expect(interventions.engagement).toBeTruthy();
  });

  rapidTest('Student should require engagement intervention if they are failing math', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingMath: true,
      onTrack: true,
      schoolsAttended: 1,
      absentPercent: 0,
    }, 4);

    expect(interventions.engagement).toBeTruthy();
  });

  rapidTest('Student should require engagement intervention if they are failing any other class', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingOther: true,
      onTrack: true,
      schoolsAttended: 1,
      absentPercent: 0,
    }, 4);

    expect(interventions.engagement).toBeTruthy();
  });

  rapidTest('Student should require english intervention if they are failing english', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingEnglish: true
    });

    expect(interventions.english).toBeTruthy();
  });

  rapidTest('Student should not require english intervention if they are passing english', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingEnglish: false
    });

    expect(interventions.english).toBeFalsy();
  });

  rapidTest('Student should require english intervention if they are failing math', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingMath: true
    });

    expect(interventions.math).toBeTruthy();
  });

  rapidTest('Student should not require math intervention if they are passing math', rapid => {
    const interventions = rapid.controllers.riskDataController.calcInterventions({
      failingMath: false
    });

    expect(interventions.math).toBeFalsy();
  });

  // Individual key risk calculation tests //

  rapidTest('calculateRiskLevelsForKey absentPercent should return low for 0-5% regardless of grade', rapid => {
    for(let absentPercent = 0; absentPercent <= 5; absentPercent++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('low');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey absentPercent should return medium for 6-9% regardless of grade', rapid => {
    for(let absentPercent = 6; absentPercent <= 9; absentPercent++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('medium');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey absentPercent should return high for 10-29% for grades 9+', rapid => {
    for(let absentPercent = 10; absentPercent <= 29; absentPercent++) {
      for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('high');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey absentPercent should return ultra for 20+% for grades 6-8', rapid => {
    for(let absentPercent = 20; absentPercent <= 100; absentPercent++) {
      for(let grade of ['6', '7', '8']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('ultra');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey absentPercent should return high for 20-29% for grades 9+', rapid => {
    for(let absentPercent = 20; absentPercent <= 29; absentPercent++) {
      for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('high');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey absentPercent should return ultra for 30+% for grades 9+', rapid => {
    for(let absentPercent = 30; absentPercent <= 100; absentPercent++) {
      for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('absentPercent', absentPercent, grade)).toEqual('ultra');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey behaviorMarks should return low for 0 marks', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('behaviorMarks', 0, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey behaviorMarks should return low for 1+ marks for grades 6 and 7', rapid => {
    for(let marks = 1; marks <= 10; marks++) {
      for(let grade of ['6', '7']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('behaviorMarks', marks, grade)).toEqual('ultra');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey behaviorMarks should return medium for 1 mark for grades 8+', rapid => {
    for(let grade of ['8', '9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('behaviorMarks', 1, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey behaviorMarks should return high for 2-4 marks for grades 8+', rapid => {
    for(let marks = 2; marks <= 4; marks++) {
      for(let grade of ['8', '9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('behaviorMarks', marks, grade)).toEqual('high');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey behaviorMarks should return ultra for 5+ marks', rapid => {
    for(let marks = 5; marks <= 10; marks++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('behaviorMarks', marks, grade)).toEqual('ultra');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey suspended should return low if suspended is false for any grade', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('suspended', false, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey suspended should return ultra if suspended is true for any grade', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('suspended', true, grade)).toEqual('ultra');
    }
  });

  rapidTest('calculateRiskLevelsForKey gpa should return low the gpa is in range 3-4 for any grade', rapid => {
    for(let gpa = 3; gpa <= 4; gpa += 0.1) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('gpa', gpa, grade)).toEqual('low');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey gpa should return low the gpa is 2.6 or greater', rapid => {
    for(let gpa = 2.6; gpa <= 2.99; gpa += 0.01) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('gpa', gpa, grade)).toEqual('low');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey gpa should return medium if the gpa is in range 2-2.5 for any grade', rapid => {
    for(let gpa = 2; gpa <= 2.49; gpa += 0.01) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('gpa', gpa, grade)).toEqual('medium');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey gpa should return high if the gpa is in range 0-1.99 for any grade', rapid => {
    for(let gpa = 0; gpa <= 1.99; gpa += 0.01) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('gpa', gpa, grade)).toEqual('high');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey failingEnglish should return ultra if true and grade is 6-8', rapid => {
    for(let grade of ['6', '7', '8']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingEnglish', true, grade)).toEqual('ultra');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingEnglish should return medium if true and grade is 9+', rapid => {
    for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingEnglish', true, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingEnglish should return low if false', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingEnglish', false, grade)).toEqual('low');
    }
  });


  rapidTest('calculateRiskLevelsForKey failingMath should return ultra if true and grade is 6-8', rapid => {
    for(let grade of ['6', '7', '8']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingMath', true, grade)).toEqual('ultra');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingMath should return medium if true and grade is 9+', rapid => {
    for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingMath', true, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingMath should return low if false', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingMath', false, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingOther should return medium if true', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingOther', true, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey failingOther should return low if false', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('failingOther', false, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey onTrack should return low if true', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('onTrack', true, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey onTrack should return medium if false for grades 6-8', rapid => {
    for(let grade of ['6', '7', '8']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('onTrack', false, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey onTrack should return ultra if false for grades 9+', rapid => {
    for(let grade of ['9', '10', '11', '12', 'age 18', 'age 19', 'age 20', 'age 21']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('onTrack', false, grade)).toEqual('ultra');
    }
  });

  rapidTest('calculateRiskLevelsForKey retainied should return ultra if true for grade 9', rapid => {
    expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('retained', true, '9')).toEqual('ultra');
  });

  rapidTest('calculateRiskLevelsForKey retainied should return medium if true for grades other than 9', rapid => {
    for(let grade of ['6', '7', '8', '10', '11', '12']) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('retained', true, grade)).toEqual('medium');
    }
  });

  rapidTest('calculateRiskLevelsForKey retainied should return low if false', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('retained', false, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey schoolsAttended should return low if attended 1-3 schools', rapid => {
    for(let schoolsAttended = 1; schoolsAttended <= 3; schoolsAttended++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('schoolsAttended', schoolsAttended, grade)).toEqual('low');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey schoolsAttended should return medium if attended 4-5 schools', rapid => {
    for(let schoolsAttended = 4; schoolsAttended <= 5; schoolsAttended++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('schoolsAttended', schoolsAttended, grade)).toEqual('medium');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey schoolsAttended should return medium if attended 6+ schools', rapid => {
    for(let schoolsAttended = 6; schoolsAttended <= 20; schoolsAttended++) {
      for(let grade of grades) {
        expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('schoolsAttended', schoolsAttended, grade)).toEqual('high');
      }
    }
  });

  rapidTest('calculateRiskLevelsForKey hasExtracurricular should return low if true', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('hasExtracurricular', true, grade)).toEqual('low');
    }
  });

  rapidTest('calculateRiskLevelsForKey hasExtracurricular should return medium if false', rapid => {
    for(let grade of grades) {
      expect(rapid.controllers.riskDataController.calculateRiskLevelsForKey('hasExtracurricular', false, grade)).toEqual('medium');
    }
  });

});
