import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import ColorScaleSelect from 'd2-ui/lib/legend/ColorScaleSelect.component';

const classificationTypes = [{
    id: 'intervals',
    name: 'Equal Intervals',
}, {
    id: 'quantile',
    name: 'Equal counts'
}];

const styles = {
    selectField: {
        width: '100%',
    },
    colorScaleSelect: {
        width: '100%',
    },
    classes: {
        width: 50,
        top: -8,
    },
};

const NumberStyle = ({ classification, classes }) => (
    <div>
        <SelectField
            label={i18next.t('Classification')}
            value={classification || classificationTypes[0].id}
            items={classificationTypes}
            onChange={() => {}}
            style={styles.selectField}
        />
        <ColorScaleSelect
            label={i18next.t('Classes')}
            onChange={() => {}}
            style={styles.colorScaleSelect}
            classesStyle={styles.classes}
        />
    </div>
);

NumberStyle.propTypes = {

};

export default NumberStyle;
