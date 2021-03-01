import { Request } from 'express';
import { isDate, isEqual, isObject, transform } from 'lodash';
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object: any, base: any) {
    function changes(object: any, base: any) {
        return transform(object, function (result: any, value, key) {
            if (!isEqual(value, base[key]) && value != base[key]) {
                result[key] =
                    isObject(value) && isObject(base[key]) && !(isDate(value) || isDate(base[key]))
                        ? changes(value, base[key])
                        : { new: value, old: base[key] };
            }
        });
    }
    return changes(object, base);
}

export function getReqUrl(req: Request) {
    return req.headers.referer || 'urlnotfoundfromreffer';
}
