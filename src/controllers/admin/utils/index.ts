import { OrderItem } from 'sequelize/types';

export type filterType = { [key: string]: any };
export type rangeType = {
    offset?: number;
    limit?: number;
};
export type sortType = OrderItem[];

type customReqQueryType = {
    filter?: any;
    range?: Array<number> | string;
    sort?: Array<string> | string;
};
export function parseReqQuery(query: customReqQueryType) {
    let { filter, range, sort } = query;
    let rangeParsed: rangeType = {};
    let sortParsed: sortType = [];
    if (filter && typeof filter === 'string') filter = JSON.parse(filter);

    if (range && typeof range === 'string') range = JSON.parse(range);

    if (Array.isArray(range) && range.length === 2) {
        rangeParsed = {
            offset: range[0],
            limit: range[1] - range[0] + 1
        };
    }
    if (sort && typeof sort === 'string') sort = JSON.parse(sort);
    if (Array.isArray(sort)) {
        sortParsed = [sort as OrderItem];
    }
    return { filter, rangeParsed, sortParsed };
}
