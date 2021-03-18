export const registerSchema = {
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phoneNumber: { type: 'string' },
        birthDate: { type: 'string' },
        profileImg: { type: 'string' },
        role: { type: 'string' }
    },
    required: ['email', 'password', 'firstName', 'lastName', 'role'],
    type: 'object'
};
