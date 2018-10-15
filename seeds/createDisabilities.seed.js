module.exports = function createDisabilities({ models }) {
  return models.Disability.query().insert([
    {name: 'AU', fullName: 'Autism'},
    {name: 'ED', fullName: 'Emotional Disturbance'},
    {name: 'ID', fullName: 'Intellectual Disability'},
    {name: 'OI', fullName: 'Orthopedic Impairment'},
    {name: 'SLI', fullName: 'Speech / Language Impairment'},
    {name: 'VI', fullName: 'Visual Impairment'},
    {name: 'DB', fullName: 'Deaf-blindness'},
    {name: 'HI', fullName: 'Hearing Impairment'},
    {name: 'MD', fullName: 'Multiple Disability'},
    {name: 'SLD', fullName: 'Specific Learning Disability'},
    {name: 'TBI', fullName: 'Traumatic Brain Injury'},
    {name: 'OHI', fullName: 'Other Health Impairment'},
  ]);
};

module.exports.runOrder = 2;
