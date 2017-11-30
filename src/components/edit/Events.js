import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import sortBy from 'lodash/fp/sortBy';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import EventPeriodSelect from '../periods/EventPeriodSelect';
import FilterGroup from '../filter/FilterGroup';
import ImageSelect from '../d2-ui/ImageSelect';
import DataItemSelect from '../dataItem/DataItemSelect';
import DataItemStyle from '../dataItem/DataItemStyle';
import ColorPicker from '../d2-ui/ColorPicker';
import OrgUnitTree from '../orgunits/OrgUnitTree';

import {
    setProgram,
    setProgramStage,
    setStyleDataItem,
    setEventCoordinateField,
    setEventClustering,
    setEventPointColor,
    setEventPointRadius
} from '../../actions/layerEdit';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        padding: 12,
        height: 300,
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
    },
    column: {
        width: 'calc(50% - 12px)',
        padding: 12,
        float: 'left',
    },
    cluster: {
        margin: -12,
    },
    colorRadius: {
        clear: 'both',
        height: 130,
    },
    color: {
        marginTop: 16,
        display: 'block',
        float: 'left',
        width: 66,
    },
    colorLabel: {
        marginRight: 16,
        marginBottom: 4,
        lineHeight: '18px',
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: 12,
    },
    radius: {
        display: 'block',
        float: 'left',
        width: 64,
    },
    dataItemSelect: {
        width: '100%',
        top: -16,
    },
};

class EventDialog extends Component {
    render() {
        const {
            programAttributes = [],
            dataElements = [],
            columns = [],
            rows = [],
            eventCoordinateField,
            eventClustering,
            eventPointColor,
            eventPointRadius,
            styleDataItem,
            method,
            classes,
            colorScale,
            program,
            programStage,
            setProgram,
            setProgramStage,
            setStyleDataItem,
            setEventCoordinateField,
            setEventClustering,
            setEventPointColor,
            setEventPointRadius,
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];
        // const period = filters.filter(r => r.dimension === 'pe')[0];

        // Merge data elements and program attributes, filter out items not supported, and sort the result
        const dataItems = sortBy('name', [ ...programAttributes, ...dataElements ]
            .filter(item => !['FILE_RESOURCE', 'ORGANISATION_UNIT', 'COORDINATE'].includes(item.valueType))
        );

        const coordinateFields = [{
            id: 'event',
            name: i18next.t('Event location'),
        }, ...dataItems.filter(field => field.valueType === 'COORDINATE')];

        return (
            <Tabs>
                <Tab label={i18next.t('data')}>
                    <div style={styles.content}>
                        <div style={styles.flexFull}>
                            <ProgramSelect
                                program={program}
                                onChange={setProgram}
                                style={styles.flexField}
                            />
                            <ProgramStageSelect
                                program={program}
                                programStage={programStage}
                                onChange={setProgramStage}
                                style={styles.flexField}
                            />
                        </div>
                        <EventPeriodSelect
                            style={styles.flexField}
                        />
                        <SelectField
                            label={i18next.t('Coordinate field')}
                            items={coordinateFields}
                            value={eventCoordinateField || 'event'}
                            onChange={field => setEventCoordinateField(field.id)}
                            style={styles.flexField}
                        />
                        <div style={styles.flexField}></div>
                    </div>
                </Tab>
                <Tab label={i18next.t('Filter')}>
                    <div style={styles.content}>
                        <FilterGroup
                            program={program}
                            programStage={programStage}
                            filters={columns.filter(c => c.filter !== undefined)}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            // items={orgUnits ? orgUnits.items : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Style')}>
                    <div style={styles.content}>
                        <div style={styles.column}>
                            <div style={styles.cluster}>
                                <ImageSelect
                                    id='cluster'
                                    img='images/cluster.png'
                                    title={i18next.t('Group events')}
                                    onClick={() => setEventClustering(true)}
                                    isSelected={eventClustering}
                                />
                                <ImageSelect
                                    id='nocluster'
                                    img='images/nocluster.png'
                                    title={i18next.t('View all events')}
                                    onClick={() => setEventClustering(false)}
                                    isSelected={!eventClustering}
                                />
                            </div>
                            <div style={styles.colorRadius}>
                                <div style={styles.color}>
                                    <div style={styles.colorLabel}>{i18next.t('Color')}</div>
                                    <ColorPicker
                                        color={eventPointColor}
                                        onChange={setEventPointColor}
                                    />
                                </div>
                                <TextField
                                    type='number'
                                    label={i18next.t('Radius')}
                                    value={eventPointRadius}
                                    onChange={setEventPointRadius}
                                    style={styles.radius}
                                />
                            </div>
                        </div>
                        <div style={styles.column}>
                            {dataElements ?
                                <DataItemSelect
                                    label={i18next.t('Style by data item')}
                                    items={dataItems}
                                    value={styleDataItem ? styleDataItem.id : null}
                                    onChange={setStyleDataItem}
                                    style={styles.dataItemSelect}
                                />
                            : null}
                            {styleDataItem ?
                                <DataItemStyle
                                    method={method}
                                    classes={classes}
                                    colorScale={colorScale}
                                    {...styleDataItem}
                                />
                            : null}
                        </div>
                    </div>
                </Tab>
            </Tabs>
        );
    }
}



const mapStateToProps = (state) => {
    const layer = state.layerEdit;
    const programId = layer.program ? layer.program.id : null;
    const programStageId = layer.programStage ? layer.programStage.id : null;

    return {
        // programAttributes: state.programTrackedEntityAttributes[programId],
        // programStages: state.programStages[programId],
        // dataElements: state.programStageDataElements[programStageId],
        // optionSets: state.optionSets,
        // orgUnitTree: state.orgUnitTree,
    };
};

export default connect(
    null,
    {
        setProgram,
        setProgramStage,
        setStyleDataItem,
        setEventCoordinateField,
        setEventClustering,
        setEventPointColor,
        setEventPointRadius
    }
)(EventDialog);
