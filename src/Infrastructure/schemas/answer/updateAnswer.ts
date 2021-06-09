export const updateAnswer = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                name: { type: 'string' },
                questionId: { type: 'string' }
            },
            type: 'object',
            required: ['name', 'questionId']
        }
    },
    required: ['id', 'data'],
    type: 'object'
};
