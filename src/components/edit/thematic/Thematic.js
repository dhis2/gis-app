import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import ValueTypeSelect from './ValueTypeSelect';
import AggregationTypeSelect from './AggregationTypeSelect';
import IndicatorGroupSelect from '../../indicator/IndicatorGroupSelect';
import GroupIndicatorSelect from '../../indicator/GroupIndicatorSelect';
import ProgramSelect from '../../program/ProgramSelect';
import ProgramIndicatorSelect from '../../program/ProgramIndicatorSelect';
import DataElementGroupSelect  from '../../dataElement/DataElementGroupSelect';
import DataElementSelect  from '../../dataElement/DataElementSelect';
import DataItemSelect from '../../dataItem/DataItemSelect';
import DataSetsSelect from '../../dataSets/DataSetsSelect';
import ThematicPeriodSelect from '../../periods/ThematicPeriodSelect';
import OrgUnitTree from '../../orgunits/OrgUnitTree';
import OrgUnitGroupSelect from '../../orgunits/OrgUnitGroupSelect';
import OrgUnitLevelSelect from '../../orgunits/OrgUnitLevelSelect';
import UserOrgUnits from '../../orgunits/UserOrgUnitsSelect';


import {
    setIndicatorGroup,
    setIndicator,
    setProgram,
    setProgramIndicator,
    setDataElementGroup,
    setDataElement,
    setDataSetItem,
    setOrgUnitLevels,
    setOrgUnitGroups,
    setUserOrgUnits,
    toggleOrganisationUnit,
} from '../../../actions/layerEdit';

import {
    getIndicatorFromColumns,
    getProgramIndicatorFromColumns,
    getReportingRateFromColumns,
    getOrgUnitNodesFromRows,
    getOrgUnitLevelsFromRows,
    getOrgUnitGroupsFromRows,
    getUserOrgUnitsFromRows,
} from '../../../util/analytics';

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
    flexHalf: {
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
        program,
        dataElementGroup,
        setIndicatorGroup,
        setIndicator,
        setProgram,
        setProgramIndicator,
        setDataElementGroup,
        setDataElement,
        setDataSetItem,
        setOrgUnitLevels,
        setOrgUnitGroups,
        setUserOrgUnits,
        toggleOrganisationUnit,
    } = props;

    const selectedUserOrgUnits = getUserOrgUnitsFromRows(rows);

    console.log('selectedUserOrgUnits', selectedUserOrgUnits);


    return (
        <Tabs>
            <Tab label={i18next.t('data')}>
                <div style={styles.content}>
                    <ValueTypeSelect
                        value={valueType}
                        style={styles.flexHalf}
                    />
                    <div style={styles.flexFull}>
                        {(!valueType || valueType === 'in') && [ // Indicator (default)
                            <IndicatorGroupSelect
                                key='group'
                                indicatorGroup={indicatorGroup}
                                onChange={setIndicatorGroup}
                                style={styles.flexHalf}
                            />,
                            <GroupIndicatorSelect
                                key='indicator'
                                indicatorGroup={indicatorGroup}
                                indicator={getIndicatorFromColumns(columns)}
                                onChange={setIndicator}
                                style={styles.flexHalf}
                            />,
                        ]}
                        {valueType === 'pi' && [ // Program indicator
                            <ProgramSelect
                                key='program'
                                program={program}
                                onChange={setProgram}
                                style={styles.flexHalf}
                            />,
                            <ProgramIndicatorSelect
                                key='indicator'
                                program={program}
                                programIndicator={getProgramIndicatorFromColumns(columns)}
                                onChange={setProgramIndicator}
                                style={styles.flexHalf}
                            />
                        ]}
                        {valueType === 'de' && [ // Data element
                            <DataElementGroupSelect
                                key='group'
                                dataElementGroup={dataElementGroup}
                                onChange={setDataElementGroup}
                                style={styles.flexHalf}
                            />,
                            <DataElementSelect
                                key='element'
                                dataElementGroup={dataElementGroup}
                                onChange={setDataElement}
                                style={styles.flexHalf}
                            />,
                        ]}
                        {valueType === 'di' && [ // Event data items
                            <ProgramSelect
                                key='program'
                                program={program}
                                onChange={setProgram}
                                style={styles.flexHalf}
                            />,
                            <DataItemSelect
                                key='item'
                                program={program}
                                // value={styleDataItem ? styleDataItem.id : null}
                                onChange={console.log}
                                style={styles.flexHalf}
                            />
                        ]}
                        {valueType === 'ds' && ( // Reporting rates
                            <DataSetsSelect
                                key='item'
                                dataSet={getReportingRateFromColumns(columns)}
                                onChange={setDataSetItem}
                                style={styles.flexHalf}
                            />
                        )}
                    </div>
                    <ThematicPeriodSelect
                        style={styles.flexHalf}
                    />
                    <AggregationTypeSelect
                        style={styles.flexHalf}
                    />
                </div>
            </Tab>
            <Tab label={i18next.t('Organisation units')}>
                <div style={styles.content}>
                    <div style={styles.flexHalf}>
                        <OrgUnitTree
                            selected={getOrgUnitNodesFromRows(rows)}
                            onClick={toggleOrganisationUnit}
                            disabled={selectedUserOrgUnits.length ? true : false}
                        />
                    </div>
                    <div style={styles.flexHalf}>
                        <OrgUnitLevelSelect
                            orgUnitLevel={getOrgUnitLevelsFromRows(rows)}
                            onChange={setOrgUnitLevels}
                        />
                        <OrgUnitGroupSelect
                            orgUnitGroup={getOrgUnitGroupsFromRows(rows)}
                            onChange={setOrgUnitGroups}

                        />
                        <UserOrgUnits
                            selected={selectedUserOrgUnits}
                            onChange={setUserOrgUnits}
                        />
                    </div>
                </div>
            </Tab>
            <Tab label={i18next.t('Style')}>

            </Tab>
        </Tabs>
    );

};

export default connect(
    null,
    {
        setIndicatorGroup,
        setIndicator,
        setProgram,
        setProgramIndicator,
        setDataElementGroup,
        setDataElement,
        setDataSetItem,
        setOrgUnitLevels,
        setOrgUnitGroups,
        setUserOrgUnits,
        toggleOrganisationUnit,
    }
)(ThematicDialog);

