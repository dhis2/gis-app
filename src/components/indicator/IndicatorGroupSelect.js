import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import IndicatorSelect from './IndicatorSelect';
import { loadIndicatorGroups } from '../../actions/indicators';
import { setIndicatorGroup } from '../../actions/layerEdit';

export const IndicatorGroupSelect = (props) => {
    const {
        indicatorGroups,
        indicatorGroup,
        loadIndicatorGroups,
        setIndicatorGroup,
    } = props;

    if (!indicatorGroups) {
        loadIndicatorGroups();
        return null;
    }

    return [
        <SelectField
            key='groups'
            {...props}
            label={i18next.t('Indicator group')}
            items={indicatorGroups}
            value={indicatorGroup}
            onChange={group => setIndicatorGroup(group.id)}
        />,
        (indicatorGroup ?
            <IndicatorSelect
                key='indicators'
                indicatorGroup={indicatorGroup}
                {...props}
            />
        : null),
    ];
};

export default connect(
    (state) => ({
        indicatorGroups: state.indicatorGroups,
        indicatorGroup: state.layerEdit.indicatorGroup,
    }),
    { loadIndicatorGroups, setIndicatorGroup }
)(IndicatorGroupSelect);
