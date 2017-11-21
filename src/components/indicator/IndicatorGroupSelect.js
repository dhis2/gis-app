import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadIndicatorGroups } from '../../actions/indicators';

const IndicatorGroupSelect = (props) => {
    const { indicatorGroups, loadIndicatorGroups } = props
    console.log('props', props);

    if (!indicatorGroups) {
        loadIndicatorGroups();
    }

    return (
        <SelectField
            label={i18next.t('Indicator group')}
            // items={items}
            //value={dimConf.indicator.objectName} // TODO: Use config value
            // style={{ marginRight: 24 }}
            onChange={console.log}
        />
    );

};

export default connect(
    (state) => ({
        indicatorGroups: state.indicatorGroups,
    }),
    { loadIndicatorGroups }
)(IndicatorGroupSelect);

