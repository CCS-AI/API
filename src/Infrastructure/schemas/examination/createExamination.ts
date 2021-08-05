export const createExamination = {
    additionalProperties: false,
    properties: {
        pmfId: { type: 'string' },
        info: { type: 'array' },
        speechAudiometry: { type: 'object' },
        patientTestBackground: { type: 'string' },
        questionnaireResults: { type: 'array' },
        summary: { type: 'string' },
        examinerId: { type: 'string' }
    },
    required: ['pmfId', 'info'],
    type: 'object'
};
