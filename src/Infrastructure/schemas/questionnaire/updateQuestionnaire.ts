export const updateQuestionnaire = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                name: { type: 'string' }
            },
            type: 'object',
            required: ['name']
        }
    },
    required: ['id', 'data'],
    type: 'object'
};
