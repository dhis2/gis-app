import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import ValueTypeSelect from './ValueTypeSelect';
import AggregationTypeSelect from './AggregationTypeSelect';
import IndicatorGroupSelect from '../../indicator/IndicatorGroupSelect';
import GroupIndicatorSelect from '../../indicator/GroupIndicatorSelect';
import ThematicProgramIndicatorSelect from '../../program/ThematicProgramIndicatorSelect';
import ThematicPeriodSelect from '../../periods/ThematicPeriodSelect';
import OrgUnitTree from '../../../containers/OrgUnits';
import { setIndicatorGroup, setIndicator } from '../../../actions/layerEdit';
import { getIndicatorFromColumns, getOrgUnitsFromRows } from '../../../util/analytics';

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
    flexFull: {
        flex: '100%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
    }
};

const ThematicDialog = (props) => {
    const {
        rows,
        columns,
        valueType,
        indicatorGroup,
        setIndicatorGroup,
        setIndicator
    } = props;

    const orgUnits = getOrgUnitsFromRows(rows);
    const indicator = getIndicatorFromColumns(columns);

    console.log('indicator', indicator);

    return (
        <Tabs>
            <Tab label={i18next.t('data')}>
                <div style={styles.content}>
                    <ValueTypeSelect
                        value={valueType}
                        style={styles.flexField}
                    />
                    <div style={styles.flexFull}>
                        {(!valueType || valueType === 'in') && [
                            <IndicatorGroupSelect
                                key='group'
                                indicatorGroup={indicatorGroup}
                                onChange={setIndicatorGroup}
                                style={styles.flexField}
                            />,
                            <GroupIndicatorSelect
                                key='indicator'
                                indicatorGroup={indicatorGroup}
                                indicator={indicator}
                                onChange={setIndicator}
                                style={styles.flexField}
                            />,
                        ]}
                        {valueType === 'pi' && [
                            <ThematicProgramIndicatorSelect
                                key='program'
                                style={styles.flexField}
                            />
                        ]}
                    </div>
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
                        selected={orgUnits}
                    />
                </div>
            </Tab>
            <Tab label={i18next.t('Style')}>

            </Tab>
        </Tabs>
    );

};

export default connect(
    null,
    { setIndicatorGroup, setIndicator }
)(ThematicDialog);


