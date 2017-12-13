import React from 'react';
import i18next from 'i18next';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

// Method constants
const PREDEFINED = 1;
const EQUAL_INTERVALS = 2; // Default automaatic legend

const styles = {
    label: {
        display: 'inline-block',
        lineHeight: '24px',
        verticalAlign: 'top',
    },
    radioGroup: {
        display: 'inline-block',
    },
    radioButton: {
        display: 'inline-block',
        paddingLeft: 16,
        width: 'auto',
    },
};

export const LegendTypeSelect = ({ method, onChange, style }) => (
    <div style={style}>
        <span style={styles.label}>{i18next.t('Legend type')}:</span>
        <RadioButtonGroup
            name='method'
            defaultSelected={method === 1 ? PREDEFINED : EQUAL_INTERVALS}
            onChange={(event, type) => onChange(type)}
            style={styles.radioGroup}
        >
            <RadioButton
                value={EQUAL_INTERVALS}
                label={i18next.t('Automatic')}
                style={styles.radioButton}
            />
            <RadioButton
                value={PREDEFINED}
                label={i18next.t('Predefined')}
                style={styles.radioButton}
            />
        </RadioButtonGroup>
    </div>
);

export default LegendTypeSelect;
