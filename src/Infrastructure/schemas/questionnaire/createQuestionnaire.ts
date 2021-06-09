export const createQuestionnaire = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' }
    },
    required: ['name'],
    type: 'object'
};
