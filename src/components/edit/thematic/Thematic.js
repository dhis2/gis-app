import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import ValueTypeSelect from './ValueTypeSelect';
import AggregationTypeSelect from './AggregationTypeSelect';
import IndicatorGroupSelect from '../../indicator/IndicatorGroupSelect';
import ThematicPeriodSelect from '../../periods/ThematicPeriodSelect';
import OrgUnitTree from '../../../containers/OrgUnits';

const styles = {
    content: { // TODO: reuse styles
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        padding: 12,
        // height: 300,
        overflowY: 'auto',
    },
    flexField: {
        flex: '50%',
        minWidth: 230,
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
};

class Thematic extends Component {

    render() {
        const {
            rows = [],
            valueType,
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];

        return (
            <Tabs>
                <Tab label={i18next.t('data')}>
                    <div style={styles.content}>
                        <ValueTypeSelect
                            value={valueType}
                            style={styles.flexField}
                        />
                        {!valueType || valueType === 'in' ?
                            <IndicatorGroupSelect
                                style={styles.flexField}
                            />
                        : null}
                        <ThematicPeriodSelect
                            style={styles.flexField}
                        />
                        <AggregationTypeSelect
                            style={styles.flexField}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            selected={orgUnits ? orgUnits.items : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Style')}>

                </Tab>
            </Tabs>
        );
    }
}

export default Thematic;
