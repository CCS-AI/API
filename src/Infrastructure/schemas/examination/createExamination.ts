export const createExamination = {
    additionalProperties: false,
    properties: {
        pmfId: { type: 'string' },
        info: { type: 'array' }
    },
    required: ['pmfId', 'info'],
    type: 'object'
};
