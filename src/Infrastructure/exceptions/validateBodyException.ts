import { ErrorObject } from 'ajv';
class ValidateBodyException {
    message: string = 'VALIDATE_BODY_EXCEPTION';
    errors: Array<customErrorObj> = [];
    constructor(ajvErrors?: ErrorObject[] | null) {
        ajvErrors?.forEach((item) => {
            this.errors.push({ field: item.dataPath.split('.').pop(), message: item.message });
        });
    }
}
type customErrorObj = {
    field?: string;
    message?: string;
};
export default ValidateBodyException;
