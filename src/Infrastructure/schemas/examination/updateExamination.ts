export const updateExamination = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                pmfId: { type: 'string' },
                info: { type: 'object' },
                speechAudiometry: { type: 'object' },
                patientTestBackground: { type: 'string' },
                questionnaireResults: { type: 'object' }
            },
            type: 'object'
        }
    },
    required: ['id', 'data'],
    type: 'object'
};
