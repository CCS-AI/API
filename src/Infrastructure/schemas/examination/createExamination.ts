export const createExamination = {
    additionalProperties: false,
    properties: {
        pmfid: { type: 'string' },
        info: { info: 'string' }
    },
    required: ['pmfid', 'info'],
    type: 'object'
};
