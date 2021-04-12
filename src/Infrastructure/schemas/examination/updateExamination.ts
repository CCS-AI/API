import { Examination } from 'src/domains/identity/models/Examination/examination';

export const updateExamination = {
    additionalProperties: false,
    properties: {
        id: { type: 'string' },
        examination: { type: Examination }
    },
    required: ['id'],
    type: 'object'
};
