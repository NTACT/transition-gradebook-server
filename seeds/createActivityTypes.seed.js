module.exports = function createActivityTypeGroups({ models }) {
  return models.ActivityTypeGroup.query().insertGraph([
    {name: 'Career Awareness',
      activityTypes: [
        {name: 'Career/Transition Fair (CW)'},
        {name: 'Career Exploration Online (CW)'},
        {name: 'Career Interest Inventory (CW)'},
        {name: 'Career Aptitude Assessment (CW)'},
        {name: 'Career Awareness Unit in Course (CW, CTE)'},
        {name: 'Industry Tour (CW, CTE)'},
        {name: 'Job Shadowing (CW)'},
        {name: 'Career Mentor (CW, SS)'},
        {name: 'Mock Interviews (CW, PW)'},
        {name: 'Job Search Support (CW, PW)'},
        {name: 'Resume Writing (CW, PW)'},
      ]
    },
    {name: 'Work Experience',
      activityTypes: [
        {name: 'Mock Interviews (CW, PW)'},
        {name: 'Job Search Support (CW, PW)'},
        {name: 'Resume Writing (CW, PW)'},
        {name: 'Internship (unpaid) (PW, CTE)'},
        {name: 'Internship (paid) (PW, CTE)'},
        {name: 'Volunteering (PW)'},
        {name: 'Paid Work (student initiated)(PW)'},
        {name: 'Paid Work (school/service initiated) (PW)'},
        {name: 'Job Performance Evaluation (PW)'},
        {name: 'Career Skills Instruction (problem solving, communication) (PW)'},
        {name: 'School Credit for Work (PW, CTE)'},
        {name: 'Referral Completed to VR (PW, IAC)'},
        {name: 'Outside Services for Work (PW, IAC)'},
      ]
    },
    {name: 'Inclusion',
      activityTypes: [
        {name: 'Participate in Grade Level/ Course Exams (Exit/Diploma)'},
        {name: 'Remediation for Failed Courses/Exams (Exit/Diploma, SS)'},
        {name: 'General Education Academic Core Courses (I)'},
        {name: 'General Education CTE Courses (OC, CTE, I)'},
        {name: 'General Education Elective Courses (I)'},
        {name: 'Integrated School Sponsored Extra Curricular Activities (I)'},
        {name: 'Integrated Community Activities (I)'},
      ]
    },
    {name: 'Student Supports',
      activityTypes: [
        {name: 'Career Mentor (CW, SS)'},
        {name: 'Graduation Coach/ Mentor (SS)'},
        {name: 'School Counselor for Post-School Planning (SS)'},
        {name: 'Financial/ Health-Care Planning (SS)'},
        {name: 'Integrated School Sponsored Extra Curricular Activities (I)'},
        {name: 'Integrated Community Activities (I)'},
      ]
    },
    {name: 'Collaboration',
      activityTypes: [
        {name: 'Family Linked to External Supports (FI)'},
        {name: 'Family Attended/ Provided Info for IEP (FI)'},
        {name: 'Attended Transition or Career Fair for Families (FI)'},
        {name: 'Family Reviewed/ Provided Transition Assessment Data (FI)'},
        {name: 'Intradisciplinary planning (IAC)'},
        {name: 'Interagency Transition Planning Meeting (IAC)'},
        {name: 'Outside Services for Work (PW, IAC)'},
        {name: 'Referral Complete to VR (PW, IAC)'},
        {name: 'Referral Complete to other adult agency (IAC)'},
        {name: 'Information Shared with Outside Agency (IAC)'},
      ]
    },
  ]);
};

module.exports.runOrder = 1;
