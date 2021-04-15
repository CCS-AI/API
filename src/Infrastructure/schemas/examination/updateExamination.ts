export const updateExamination = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                pmfId: { type: 'string' },
                info: { type: 'array' }
            },
            type: 'object'
        }
    },
    required: ['id'],
    type: 'object'
};
