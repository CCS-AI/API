export const createQuestion = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        questionnaireId: { type: 'string' }
    },
    required: ['name', 'questionnaireId'],
    type: 'object'
};
