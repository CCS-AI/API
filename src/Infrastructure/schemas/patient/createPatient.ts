export const createPatient = {
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        gender: { type: 'number' },
        birth: { type: 'string' },
        address: { type: 'string' },
        phone1: { type: 'string' },
        phone2: { type: 'string' },
        hmo: { type: 'number' },
        personalId: { type: 'string' }
    },
    required: [],
    type: 'object'
};
