export const updateExaminer = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        data: {
            additionalProperties: false,
            properties: {
                id: { type: 'string' },
                userid: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                licenseNumber: { type: 'string' }
            },
            type: 'object'
        }
    },
    required: ['id'],
    type: 'object'
};
