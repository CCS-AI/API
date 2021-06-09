export const createAnswer = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        questionId: { type: 'string' }
    },
    required: ['name', 'questionId'],
    type: 'object'
};
