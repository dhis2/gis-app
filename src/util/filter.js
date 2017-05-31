import isNumeric from 'd2-utilizr/lib/isNumeric';
import isString from 'd2-utilizr/lib/isString';

const RuleType = {
    Number: 1,
    Range: 2,
    GreaterThen: 3,
    LessThen: 4,
};

export function filterData(data, filters) {
    const fieldIds = Object.keys(filters);
    let filteredData = [...data];

    Object.keys(filters).forEach(field => {
        const filter = filters[field];

        filteredData = filteredData.filter(d => {
            const value = d[field];

            if (isNumeric(value)) {
                return numericFilter(value, filter);
            } else if (isString(value)) {
                return stringFilter(value, filter);
            }
        });
    });

    return filteredData;
}


export function stringFilter(string, filter) {
    return string.toLowerCase().indexOf(filter) !== -1;
}

// https://github.com/adazzle/react-data-grid/blob/master/packages/react-data-grid-addons/src/cells/headerCells/filters/NumericFilter.js
export function numericFilter(value, filter) {
    let result = false;

    // TODO: Syntax error handling
    filter.split(',').forEach(part => {
        if (part !== '') {
            if (part.indexOf('-') > 0) { // range
                if (value >= Number(part.split('-')[0]) && value <= Number(part.split('-')[1])) {
                    result = true;
                }
            } else if (part.indexOf('>') > -1) { // greater than
                if (value >= Number(part.split('>')[1])) {
                    result = true;
                }
            } else if (part.indexOf('<') > -1) { // less than
                if (value <= Number(part.split('<')[1])) {
                    result = true;
                }
            } else { // normal values
                if (value === Number(part)) {
                    result = true;
                }
            }
        }
    });

    return result;
}

const getNumericFilterRules = (filter) => {
    const rules = [];

    filter.split(',').forEach(part => {
        if (part !== '') {
            if (part.indexOf('-') > 0) { // range
                rules.push({
                    type: 'range',
                    begin: Number(part.split('-')[0]),
                    end: Number(part.split('-')[1]),
                });
            } else if (part.indexOf('>') > -1) { // greater than
                rules.push({
                    type: 'greaterThan',
                    value: Number(part.split('>')[1]),
                });
            } else if (part.indexOf('<') > -1) { // greater than
                rules.push({
                    type: 'lessThan',
                    value: Number(part.split('<')[1]),
                });
            } else { // normal values
                rules.push({
                    type: 'number',
                    value: Number(part),
                });
            }
        }
    });

    return rules;
};
