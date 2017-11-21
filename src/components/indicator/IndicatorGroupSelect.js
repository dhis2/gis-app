import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadIndicators, loadIndicatorGroups } from '../../actions/indicators';
import { setIndicatorGroup } from '../../actions/layerEdit';

export const IndicatorGroupSelect = (props) => {
    const {
        value,
        indicatorGroups,
        indicatorGroup,
        indicators,
        loadIndicators,
        loadIndicatorGroups,
        setIndicatorGroup
    } = props;

    if (!indicatorGroups) {
        loadIndicatorGroups();
        return null;
    }

    if (indicatorGroup && !indicators) {
        loadIndicators(indicatorGroup);
    }

    console.log('#', indicators);

    return [
        <SelectField
            key='indicatorgroup'
            {...props}
            label={i18next.t('Indicator group')}
            items={indicatorGroups}
            value={indicatorGroup}
            onChange={group => setIndicatorGroup(group.id)}
        />,
    ];
};

export default connect(
    (state) => ({
        indicatorGroups: state.indicatorGroups,
        indicatorGroup: state.layerEdit.indicatorGroup,
        indicators: state.indicators[state.layerEdit.indicatorGroup],
    }),
    { loadIndicators, loadIndicatorGroups, setIndicatorGroup }
)(IndicatorGroupSelect);
