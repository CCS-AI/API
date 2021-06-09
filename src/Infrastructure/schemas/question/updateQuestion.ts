export const updateQuestion = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                name: { type: 'string' },
                questionnaireId: { type: 'string' }
            },
            type: 'object',
            required: ['name', 'questionnaireId']
        }
    },
    required: ['id', 'data'],
    type: 'object'
};
