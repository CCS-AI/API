export const updatePmf = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                patientId: { type: 'string' }
            },
            type: 'object'
        }
    },
    required: ['id'],
    type: 'object'
};
