import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import ColorScaleSelect from 'd2-ui/lib/legend/ColorScaleSelect.component';

const classificationTypes = [{
    id: 2,
    name: 'Equal Intervals',
}, {
    id: 3,
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

const Classification = ({method, classes, colorScale, setClassification, setColorScale }) => (
    <div>
        <SelectField
            label={i18next.t('Classification')}
            value={method || 2}
            items={classificationTypes}
            onChange={method =>setClassification(method.id)}
            style={styles.selectField}
        />
        <ColorScaleSelect
            label={i18next.t('Classes')}
            onChange={colorScale => setColorScale(colorScale)}
            style={styles.colorScaleSelect}
            classesStyle={styles.classes}
        />
    </div>
);

Classification.propTypes = {

};

export default Classification;
