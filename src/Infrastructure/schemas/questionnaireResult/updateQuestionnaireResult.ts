export const updateQuestionnaireResult = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                data: { type: 'object' }
            },
            type: 'object',
            required: ['data']
        }
    },
    required: ['id', 'data'],
    type: 'object'
};
