import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'd2-ui/lib/text-field/TextField';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import Checkbox from 'material-ui/Checkbox';
import OptionSetSelect from '../optionSet/OptionSetSelect';

const operators = { // TODO: Don't repeat operators
    INTEGER: [
        { id: 'EQ', name: '=' },
        { id: 'GT', name: '>' },
        { id: 'GE', name: '>=' },
        { id: 'LT', name: '<' },
        { id: 'LE', name: '<=' },
        { id: 'NE', name: '!=' }
    ],
    INTEGER_POSITIVE: [
        { id: 'EQ', name: '=' },
        { id: 'GT', name: '>' },
        { id: 'GE', name: '>=' },
        { id: 'LT', name: '<' },
        { id: 'LE', name: '<=' },
        { id: 'NE', name: '!=' }
    ],
    NUMBER: [
        { id: 'EQ', name: '=' },
        { id: 'GT', name: '>' },
        { id: 'GE', name: '>=' },
        { id: 'LT', name: '<' },
        { id: 'LE', name: '<=' },
        { id: 'NE', name: '!=' }
    ],
    DATE: [
        { id: 'EQ', name: '=' },
        { id: 'GT', name: '>' },
        { id: 'GE', name: '>=' },
        { id: 'LT', name: '<' },
        { id: 'LE', name: '<=' },
        { id: 'NE', name: '!=' }
    ],
    TEXT: [
        { id: 'IN', name: 'is' },     // TODO: i18n
        { id: '!IN', name: 'is not' } // TODO: i18n
    ],
};

const styles = {
    container: {
        float: 'left',
        height: 64,
    },
    operator: {
        marginTop: -8,
        marginRight: 24,
        width: 120,
        float: 'left',
    },
    value: {
        marginRight: 16,
        width: 216,
        top: -8,
    },
    checkbox: {
        marginTop: 26,
        marginLeft: -4,
    },
};

const DataElementFilter = ({ valueType, filter, optionSet, optionSets, loadOptionSet, onChange }, { d2 }) => {
    const items = operators[valueType];
    const i18n = d2.i18n.getTranslation.bind(d2.i18n);
    let operator;
    let value;

    if (optionSet && !optionSets[optionSet.id]) {
        loadOptionSet(optionSet.id);
    }

    if (filter) {
        const splitFilter = filter.split(':');
        operator = splitFilter[0];
        value = splitFilter[1];
    } else if (items) {
        operator = items[0].id;
    }

    console.log('valueType', filter, valueType, operator, value);

    return (
        <div style={styles.container}>

            {items ?
                <SelectField
                    label={i18n('operator')}
                    items={items}
                    value={operator}
                    onChange={newOperator => onChange(`${newOperator.id}:${value}`)}
                    style={styles.operator}
                />
            : null}

            {optionSet && optionSets[optionSet.id] ?
                <OptionSetSelect
                    options={optionSets[optionSet.id].options}
                    value={value ? value.split(';') : null}
                    onChange={newValue => onChange(`${operator}:${newValue.join(';')}`)}
                />
            : null}

            {valueType === 'INTEGER' || valueType === 'INTEGER_POSITIVE' || valueType === 'NUMBER' ?
                <TextField
                    label={i18n('value')}
                    type={valueType === 'INTEGER' || valueType === 'NUMBER' ? 'number' : 'text'}
                    value={value}
                    onChange={newValue => onChange(`${operator}:${newValue}`)}
                    style={styles.value}
                />
            : null}

            {valueType === 'BOOLEAN' ?
                <Checkbox
                    label='Yes'
                    checked={value == 1 ? true : false}
                    onCheck={(event, isChecked) => onChange(isChecked ? 'IN:1' : 'IN:0' )}
                    style={styles.checkbox}
                />
            : null}

        </div>
    )
};


DataElementFilter.contextTypes = {
    d2: PropTypes.object
};


export default DataElementFilter;
