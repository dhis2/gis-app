import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import TextField from 'd2-ui/lib/text-field/TextField';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import Checkbox from 'material-ui/Checkbox';
import OptionSetSelect from '../optionSet/OptionSetSelect';
import DatePicker from '../d2-ui/DatePicker';

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
    textField: {
        marginRight: 16,
        width: 216,
        top: -8,
    },
    checkbox: {
        marginTop: 26,
        marginLeft: -4,
    },
    datePicker: {
        float: 'left',
    },
    dateField: {
        width: 216,
        top: -8,
    }
};

const DataElementFilter = ({ valueType, filter, optionSet, optionSets, loadOptionSet, onChange }) => {
    let operators;
    let operator;
    let value;

    if (['NUMBER', 'INTEGER', 'INTEGER_POSITIVE', 'DATE'].includes(valueType)) {
        operators = [
            { id: 'EQ', name: '=' },
            { id: 'GT', name: '>' },
            { id: 'GE', name: '>=' },
            { id: 'LT', name: '<' },
            { id: 'LE', name: '<=' },
            { id: 'NE', name: '!=' }
        ];
    } else if (optionSet) {
        operators = [
            { id: 'IN', name: i18n('is') },
            { id: '!IN', name: i18n('is_not') },
        ];
    }

    if (optionSet && !optionSets[optionSet.id]) {
        loadOptionSet(optionSet.id);
    }

    if (filter) {
        const splitFilter = filter.split(':');
        operator = splitFilter[0];
        value = splitFilter[1];
    } else if (operators) {
        operator = operators[0].id;
    }

    // console.log('valueType', filter, valueType, operator, value);
    console.log('valueType', valueType);

    return (
        <div style={styles.container}>

            {operators ?
                <SelectField
                    label={i18next.t('Operator')}
                    items={operators}
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

            {['NUMBER', 'INTEGER', 'INTEGER_POSITIVE'].includes(valueType) ?
                <TextField
                    label={i18next.t('Value')}
                    type='number'
                    value={value}
                    onChange={newValue => onChange(`${operator}:${newValue}`)}
                    style={styles.textField}
                />
            : null}

            {valueType === 'BOOLEAN' ?
                <Checkbox
                    label={i18next.t('Yes')}
                    checked={value == 1 ? true : false}
                    onCheck={(event, isChecked) => onChange(isChecked ? 'IN:1' : 'IN:0' )}
                    style={styles.checkbox}
                />
            : null}

            {valueType === 'DATE' ?
                <DatePicker
                    label={i18next.t('Date')}
                    value={value}
                    onChange={(date) => onChange(`${operator}:${date}`)}
                    style={styles.datePicker}
                    textFieldStyle={styles.dateField}
                />
                : null}

        </div>
    )
};


DataElementFilter.contextTypes = {
    d2: PropTypes.object
};


export default DataElementFilter;
