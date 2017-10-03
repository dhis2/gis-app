import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import RelativePeriodsSelect from '../../containers/RelativePeriodsSelect';
import DataItemFilters from '../dataitem/DataItemFilters';
import DataItemSelect from '../dataitem/DataItemSelect';
import DataItemStyle from '../dataitem/DataItemStyle';
import NumberField from '../d2-ui/NumberField';
import DatePicker from '../d2-ui/DatePicker';
import ColorPicker from '../d2-ui/ColorPicker';
import OrgUnitTree from '../../containers/OrgUnitTree';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        padding: '0 24px',
        minHeight: 300,
    },
    checkbox: {
        marginTop: 24,
    },
    numberField: {
        display: 'block',
        width: 100,
    }
};

class EventDialog extends Component {

    static contextTypes = {
        d2: PropTypes.object,
    };

    componentDidMount() {
        const {
            program,
            programs,
            programStage,
            programStages,
            loadPrograms,
            loadProgramStages,
            dataElements,
            loadProgramStageDataElements
        } = this.props;

        // Load programs
        if (!programs) {
            loadPrograms();
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
            programStage,
            programStages,
            dataElements,
            loadProgramStages,
            loadProgramStageDataElements,
            setProgramStage
        } = this.props;

        if (program) {
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
                    console.log('Load program stages');
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
            program,
            programs,
            programStage,
            programStages,
            dataElements,
            columns = [],
            rows = [],
            filters = [],
            startDate,
            endDate,
            eventClustering,
            eventPointColor,
            eventPointRadius,
            styleDataElement,
            setProgram,
            setProgramStage,
            setStyleDataElement,
            setEventClustering,
            setEventPointColor,
            setEventPointRadius,
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];
        const period = filters.filter(r => r.dimension === 'pe')[0];

        const d2 = this.context.d2;
        const i18n = d2.i18n.getTranslation.bind(d2.i18n);

        return (
            <Tabs>
                <Tab label={i18n('data')}>
                    <div style={styles.content}>
                        {programs ?
                            <ProgramSelect
                                items={programs}
                                value={program ? program.id : null}
                                onChange={setProgram}
                            />
                        : null}
                        {programStages ?
                            <ProgramStageSelect
                                items={programStages}
                                value={programStage ? programStage.id : null}
                                onChange={setProgramStage}
                            />
                        : null}
                        <div>
                            <RelativePeriodsSelect
                                value={period ? period.items[0].id : null}
                                onChange={(value) => console.log(value)}
                            />
                            <DatePicker
                                label='Start date'
                                value={new Date(startDate)}
                                onChange={(value) => console.log(value)}
                            />
                            <DatePicker
                                label='End date'
                                value={new Date(endDate)}
                                onChange={(value) => console.log(value)}
                            />
                        </div>
                    </div>
                </Tab>
                <Tab label={i18n('filter')}>
                    <div style={styles.content}>
                        <DataItemFilters
                            dataItems={dataElements}
                            filters={columns.filter(c => c.filter)}
                        />
                    </div>
                </Tab>
                <Tab label={i18n('organisation_units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            selected={orgUnits ? orgUnits.items.map((orgUnit) => orgUnit.path) : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18n('style')}>
                    <div style={styles.content}>
                        <Checkbox
                            label={i18n('group_nearby_events_(clustering)')}
                            checked={eventClustering}
                            onCheck={(event, isChecked) => setEventClustering(isChecked)}
                            style={styles.checkbox}
                        />
                        <NumberField
                            label={i18n('point_radius')}
                            value={eventPointRadius}
                            onChange={setEventPointRadius}
                            style={styles.numberField}
                        />
                        <div>
                            Color:
                            <ColorPicker
                                color={eventPointColor}
                                onChange={setEventPointColor}
                            />
                        </div>
                        {dataElements ?
                            <DataItemSelect
                                label={i18n('style_by_data_item')}
                                items={dataElements.filter(d => d.optionSet)}
                                value={styleDataElement ? styleDataElement.id : null}
                                onChange={setStyleDataElement}
                            />
                        : null}
                        {styleDataElement ?
                            <DataItemStyle
                                {...styleDataElement}
                                onChange={(code, color) => console.log('onStyleChange', code, color)}
                            />
                        : null}
                    </div>
                </Tab>
            </Tabs>
        );
    }
}

export default EventDialog;
