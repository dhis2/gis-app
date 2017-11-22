import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadIndicators, loadIndicatorGroups } from '../../actions/indicators';
import { setIndicator, setIndicatorGroup } from '../../actions/layerEdit';


export const IndicatorSelect = (props) => {
    const {
        indicatorGroup,
        indicators,
        loadIndicators,
        setIndicator,
        indicator,
    } = props;

    if (!indicators) {
        loadIndicators(indicatorGroup);
        return null;
    }

    return (
        <SelectField
            key='indicators'
            label={i18next.t('Indicators')}
            items={indicators}
            value={indicator ? indicator.id : null}
            onChange={indicator => setIndicator(indicator)}
            {...props}
        />
    );
};

export default connect(
    (state) => ({
        indicators: state.indicators[state.layerEdit.indicatorGroup],
        indicator: state.layerEdit.columns ? state.layerEdit.columns[0].items[0] : null,
    }),
    { loadIndicators, setIndicator }
)(IndicatorSelect);
