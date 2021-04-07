export const createExaminer = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        userid: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        licenseNumber: { type: 'string' }
    },
    required: [],
    type: 'object'
};
