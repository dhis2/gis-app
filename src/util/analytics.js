import i18next from 'i18next';
import { relativePeriods } from '../constants/periods';
// import { filterOperators } from '../constants/filters';

export const getFiltersFromColumns = (columns) => {
    if (!Array.isArray(columns)) {
        return null;
    }

    const filters = columns.filter(item => item.filter);
    return filters.length ? filters : null;
};

export const getFiltersAsText = (filters) => {
    if (!Array.isArray(filters)) {
        return null;
    }

    return filters.map(({ name, filter }) => {
        const [ operator, value ] = filter.split(':');
        return `${name} ${getFilterOperatorAsText(operator)} ${value}`;
    });
};

// TODO: Cache?
export const getFilterOperatorAsText = (id) => ({
    'EQ': '=',
    'GT': '>',
    'GE': '>=',
    'LT': '<',
    'LE': '<=',
    'NE': '!=',
    'IN': i18next.t('one of'),
    '!IN': i18next.t('not one of'),
    'LIKE': i18next.t('contains'),
    '!LIKE': i18next.t('doesn\'t contains'),
}[id]);

export const getPeriodNameFromFilters = (filters) => {
    if (!Array.isArray(filters)) {
        return null;
    }

    const period = filters.filter(item => item.dimension === 'pe')[0];
    return (period && period.items) ? getPeriodNameFromId(period.items[0].id) : null;
};

export const getPeriodNameFromId = (id) => {
    const period = relativePeriods.filter(period => period.id === id)[0];
    return period ? i18next.t(period.name) : null;
};



