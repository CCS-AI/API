export const createExamination = {
    additionalProperties: false,
    properties: {
        pmfId: { type: 'string' },
        info: { type: 'object' },
        speechAudiometry: { type: 'object' },
        patientTestBackground: { type: 'string' },
        questionnaireResults: { type: 'object' }
    },
    required: ['pmfId', 'info'],
    type: 'object'
};
