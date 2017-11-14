import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import sortBy from 'lodash/fp/sortBy';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import PeriodSelect from '../../containers/PeriodSelect';
import DataElementFilters from '../../containers/FilterGroup';
import ImageSelect from '../d2-ui/ImageSelect';
import DataItemSelect from '../dataitem/DataItemSelect';
import DataItemStyle from '../dataitem/DataItemStyle';
import ColorPicker from '../d2-ui/ColorPicker';
import OrgUnits from '../../containers/OrgUnits';

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
    selectField: {
        flex: '50%',
        minWidth: 230,
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
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

    componentDidMount() {
        const {
            programs,
            program,
            programAttributes,
            programStage,
            programStages,
            loadPrograms,
            loadProgramStages,
            dataElements,
            loadProgramStageDataElements,
            loadProgramTrackedEntityAttributes,
        } = this.props;

        // Load programs
        if (!programs) {
            loadPrograms();
        }

        if (program && !programAttributes) {
            loadProgramTrackedEntityAttributes(program.id);
        }

        // Load program stages if program is selected
        if (program && !programStages) {
            loadProgramStages(program.id);
        }

        // Load program stage data elements if program stage is selected
        if (programStage && !dataElements) {
            loadProgramStageDataElements(programStage.id);
        }
    }

    componentDidUpdate(prev) {
        const {
            program,
            programAttributes,
            programStage,
            programStages,
            dataElements,
            loadProgramStages,
            loadProgramStageDataElements,
            loadProgramTrackedEntityAttributes,
            setProgramStage
        } = this.props;

        if (program) {

            if (!programAttributes) {
                loadProgramTrackedEntityAttributes(program.id);
            }

            if (programStages) {
                if (!programStage) {
                    if (programStages !== prev.programStages) {
                        // Select program stage if only one
                        if (programStages.length === 1) {
                            setProgramStage(programStages[0]);
                        }
                    }
                }
            } else {
                // Load program stages
                if (program !== prev.program) {
                    // console.log('Load program stages');
                    loadProgramStages(program.id);
                }
            }
        }

        if (programStage) {
            if (!dataElements) {
                // Load program stage data elements
                if (programStage !== prev.programStage) {
                    loadProgramStageDataElements(programStage.id);
                }
            }
        }
    }

    render() {
        const {
            programs,
            program,
            programAttributes = [],
            programStage,
            programStages,
            dataElements = [],
            columns = [],
            rows = [],
            filters = [],
            eventCoordinateField,
            eventClustering,
            eventPointColor,
            eventPointRadius,
            styleDataItem,
            method,
            classes,
            colorScale,
            setProgram,
            setProgramStage,
            setStyleDataItem,
            setEventCoordinateField,
            setEventClustering,
            setEventPointColor,
            setEventPointRadius,
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];
        const period = filters.filter(r => r.dimension === 'pe')[0];

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
                        {programs ?
                            <ProgramSelect
                                items={programs}
                                value={program ? program.id : null}
                                onChange={setProgram}
                                style={styles.selectField}
                            />
                        : null}
                        {programStages ?
                            <ProgramStageSelect
                                items={programStages}
                                value={programStage ? programStage.id : null}
                                onChange={setProgramStage}
                                style={styles.selectField}
                            />
                        : null}
                        <PeriodSelect />
                        <SelectField
                            label={i18next.t('Coordinate field')}
                            items={coordinateFields}
                            value={eventCoordinateField || 'event'}
                            onChange={field => setEventCoordinateField(field.id)}
                            style={styles.selectField}
                        />
                        { /* Placeholder div to avoid coordinate field getting full width */ }
                        <div style={styles.selectField}></div>
                    </div>
                </Tab>
                <Tab label={i18next.t('Filter')}>
                    <div style={styles.content}>
                        {programStage ?
                            <DataElementFilters
                                dataElements={dataItems}
                                filters={columns.filter(c => c.filter !== undefined)}
                            />
                        : <div>{i18next.t('Filtering is available after selecting a program stage.')}</div>}
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <OrgUnits
                            items={orgUnits ? orgUnits.items : []}
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

export default EventDialog;
