module.exports = context => {
  const enums = require('../enums');
  const { Model, models } = context;

  class StudentTermInfo extends Model {
    static get tableName() { return 'student_term_info'; }

    static get jsonSchema() {
      return {
        type: 'object',
        required: ['studentId', 'termId'],
        properties: {
          id: {type: 'integer'},
          studentId: {type: 'integer'},
          termId: {type: 'integer'},

          gradeType: {type: 'string', enum: enums.gradeTypes},
          grade: {type: ['string', 'null']},

          gradeLevel: {type: 'string', enum: enums.grades},
          exitCategory: {type: ['string', 'null']},
          postSchoolOutcome: {type: ['string', 'null']},

          // Risk factors
          absentPercent: {type: ['number', 'null']},
          behaviorMarks: {type: ['integer', 'null']},
          suspended: {type: ['boolean', 'null']},
          failingEnglish: {type: ['boolean', 'null']},
          failingMath: {type: ['boolean', 'null']},
          failingOther: {type: ['boolean', 'null']},
          onTrack: {type: ['boolean', 'null']},
          retained: {type: ['boolean', 'null']},
          schoolsAttended: {type: ['integer', 'null']},
          hasExtracurricular: {type: ['boolean', 'null']},

          // Skills
          hasSelfDeterminationSkills: {type: ['boolean', 'null']},
          hasIndependentLivingSkills: {type: ['boolean', 'null']},
          hasTravelSkills: {type: ['boolean', 'null']},
          hasSocialSkills: {type: ['boolean', 'null']},

          // Career dev + IEP
          attendedIepMeeting: {type: ['boolean', 'null']},
          iepRole: {type: ['string', 'null']},
          hasGraduationPlan: {type: ['boolean', 'null']},
        },
      };
    }

    static get relationMappings() {
      return {

        student: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Student,
          join: {
            from: 'student_term_info.studentId',
            to: 'students.id',
          }
        },

        term: {
          relation: Model.BelongsToOneRelation,
          modelClass: models.Term,
          join: {
            from: 'student_term_info.termId',
            to: 'terms.id',
          }
        },

        schoolYear: {
          relation: Model.ManyToManyRelation,
          modelClass: models.SchoolYear,
          join: {
            from: 'student_term_info.termId',
            through: {
              from: 'terms.id',
              to: 'terms.schoolYearId',
            },
            to: 'school_years.id',
          }
        },

        studentDisabilities: {
          relation: Model.HasManyRelation,
          modelClass: models.StudentDisability,
          join: {
            from: 'student_term_info.studentId',
            to: 'student_disabilities.studentId',
          }
        },

        activityEvents: {
          relation: Model.ManyToManyRelation,
          modelClass: models.ActivityEvent,
          join: {
            from: 'student_term_info.studentId',
            through: {
              from: 'activities.studentId',
              to: 'activities.id',
            },
            to: 'activity_events.activityId',
          }   
        },

      };
    }

    $beforeValidate(jsonSchema, json, opt) {
      // exitCategory and postSchoolOutcome are only required when student is post-school
      if(json.gradeLevel === 'Post-school') {
        return {
          ...jsonSchema,
          required: [...jsonSchema.required, 'exitCategory', 'postSchoolOutcome'],
          properties: {
            ...jsonSchema.properties,
            exitCategory: {type: 'string'},
            postSchoolOutcome: {type: 'string'},
          },
        };
      }

      return jsonSchema;
    }
  }

  return StudentTermInfo;
};
