import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
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
import UserOrgUnitsSelect from '../../orgunits/UserOrgUnitsSelect';
import LegendTypeSelect from './LegendTypeSelect';
import Checkbox from '../../d2-ui/Checkbox';
import FontStyle from '../../d2-ui/FontStyle';
import Classification from '../../style/Classification';
import LegendSetSelect from '../../legendSet/LegendSetSelect';

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
    setClassification,
    setRadiusLow,
    setRadiusHigh,
    setLabels,
    setLabelFontColor,
    setLabelFontSize,
    setLabelFontWeight,
    setLabelFontStyle,
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
        height: 330,
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
    },
    wrapper: {
        width: '100%',
        clear: 'both',
        height: 64,
    },
    checkbox: {
        float: 'left',
        margin: '24px 0 0 12px',
        width: 180,
    },
    font: {
        float: 'left',
        marginTop: -8,
    },
};

const ThematicDialog = (props) => {
    const {
        rows,
        columns,
        valueType,
        indicatorGroup,
        program,
        dataElementGroup,
        method,
        classes,
        colorScale,
        radiusLow,
        radiusHigh,
        labels,
        labelFontColor,
        labelFontSize,
        labelFontWeight,
        labelFontStyle,
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
        setClassification,
        setRadiusLow,
        setRadiusHigh,
        setLabels,
        setLabelFontColor,
        setLabelFontSize,
        setLabelFontWeight,
        setLabelFontStyle,
    } = props;

    const selectedUserOrgUnits = getUserOrgUnitsFromRows(rows);

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
                        <UserOrgUnitsSelect
                            selected={selectedUserOrgUnits}
                            onChange={setUserOrgUnits}
                        />
                    </div>
                </div>
            </Tab>
            <Tab label={i18next.t('Style')}>
                <div style={styles.content}>
                    <LegendTypeSelect
                        method={method}
                        onChange={setClassification}
                    />
                    {method !== 1 &&
                        <Classification
                            method={method}
                            classes={classes}
                            colorScale={colorScale}
                        />
                    }
                    {method === 1 &&
                        <LegendSetSelect
                            onChange={console.log}
                        />
                    }
                    <TextField
                        type='number'
                        label={i18next.t('Low size')}
                        value={radiusLow !== undefined ? radiusLow : 5}
                        onChange={setRadiusLow}
                        // style={styles.radius}
                    />
                    <TextField
                        type='number'
                        label={i18next.t('High size')}
                        value={radiusHigh !== undefined ? radiusHigh : 15}
                        onChange={setRadiusHigh}
                        // style={styles.radius}
                    />
                    <div style={styles.wrapper}>
                        <Checkbox
                            label={i18next.t('Show labels')}
                            checked={labels}
                            onCheck={setLabels}
                            style={styles.checkbox}
                        />
                        {labels &&
                            <FontStyle
                                color={labelFontColor}
                                size={labelFontSize}
                                weight={labelFontWeight}
                                fontStyle={labelFontStyle}
                                onColorChange={setLabelFontColor}
                                onSizeChange={setLabelFontSize}
                                onWeightChange={setLabelFontWeight}
                                onStyleChange={setLabelFontStyle}
                                style={styles.font}
                            />
                        }
                    </div>
                </div>
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
        setClassification,
        setRadiusLow,
        setRadiusHigh,
        setLabels,
        setLabelFontColor,
        setLabelFontSize,
        setLabelFontWeight,
        setLabelFontStyle,
    }
)(ThematicDialog);

