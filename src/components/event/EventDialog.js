import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
// import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import DataItemSelect from '../program/DataItemSelect';
import DataElement from './DataElement';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        padding: '0 24px 16px',
        minHeight: 300,
    },
};

class EventDialog extends Component {

    state = {
        programId: null,
        programStageId: null,
        dataElementId: null,
        stages: [],
        dataElements: [],
    };

    componentDidUpdate(prevProps) { // TODO: best place?
        const program = this.props.programs.filter(p => p.id === this.state.programId)[0];
        const programStageId = this.state.programStageId;

        if (program) {
            const stages = program.stages;

            if (stages && this.state.stages !== stages) {
                let stage = stages.filter(s => s.id === programStageId)[0];

                this.setState({
                   stages: stages,
                   dataElements: stage ? stage.dataElements : [],
                });

                if (!stage && stages.length === 1) {
                    this.onProgramStageSelect(stages[0].id);
                }
            }
        }

        this.onLayerChange();
    }

    onLayerChange() {
        const config = {
            type: "event",
            title: "Events",
            opacity: 0.95,
            id: "overlay-0",
            isNew: true,
            program: {
                id: "eBAyeGv0exc",
                name: "Inpatient morbidity and mortality"
            },
            programStage: {
                id: "Zj7UnCAulEk",
                name: "Single-Event Inpatient morbidity and mortality"
            },
            startDate: "2016-08-28",
            endDate: "2017-08-28",
            columns: [{
                dimension: "oZg33kd9taw",
                name: "Gender",
            }],
            rows: [{
                dimension: "ou",
                items: [{
                    id: "ImspTQPwCqd"
                }]
            }],
            eventClustering: false,
            eventPointColor: "333333",
            eventPointRadius: 6,
            styleByDataItem: {
                id: 'oZg33kd9taw',
                name: 'Gender',
                options: {
                    'Male': {
                        name: 'Male',
                        color: 'black',
                    },
                    'Female': {
                        name: 'Female',
                        color: 'red',
                    }
                }
            },
            isLoaded: false,
            editCounter: 1
        };

        this.props.onChange(config);
    }

    onProgramSelect(programId) {
        const program = this.props.programs.filter(p => p.id === programId)[0];

        if (!program.stages) {
            this.props.loadProgramStages(program.id);
        }

        this.setState({
            programId,
            programStageId: null,
            dataElementId: null,
            stages: [],
            dataElements: [],
            styleByDataItem: null
        });
    }

    onProgramStageSelect(programStageId) {
        this.props.loadProgramStageDataElements(this.state.programId, programStageId);
        this.setState({ programStageId });
    }

    onDataElementSelect(dataElementId) {
        const dataElement = this.state.dataElements.filter(d => d.id === dataElementId)[0];

        if (dataElement.optionSet) {
            if (!this.props.optionSets[dataElement.optionSet.id]) {
                this.props.loadOptionSet(dataElement.optionSet.id);
            }
        }

        this.setState({ dataElementId });
    }

    render() {
        const { programs, optionSets } = this.props;
        const {
            programId,
            programStageId,
            dataElementId,
            stages,
            dataElements
        } = this.state;
        let dataElement;
        let optionSet;

        if (dataElementId) {
            dataElement = dataElements.filter(d => d.id === dataElementId)[0];

            if (dataElement.optionSet) {
                optionSet = optionSets[dataElement.optionSet.id];
            }
        }

        return (
            <Tabs>
                <Tab label='Data'>
                    <div style={styles.content}>
                        <ProgramSelect
                            items={programs}
                            value={programId}
                            onChange={programId => this.onProgramSelect(programId)}
                        />
                        {programId ?
                            <ProgramStageSelect
                                items={stages}
                                value={programStageId}
                                onChange={programStageId => this.onProgramStageSelect(programStageId)}
                            />
                        : null}
                    </div>
                </Tab>
                <Tab label='Filter'>
                    <div style={styles.content}>

                    </div>
                </Tab>
                <Tab label='Organisation units'>
                    <div style={styles.content}>

                    </div>
                </Tab>
                <Tab label='Style'>
                    <div style={styles.content}>
                        {programStageId ?
                            <DataItemSelect
                                items={dataElements}
                                value={dataElementId}
                                onChange={dataElementId => this.onDataElementSelect(dataElementId)}
                            />
                            : null}

                        {dataElement ?
                            <DataElement
                                {...dataElement}
                                optionSet={optionSet ? optionSet : null}
                                onChange={(config) => console.log('onStyleChange', config)}
                            />
                            : null}
                    </div>
                </Tab>
            </Tabs>
        );
    }
}

export default EventDialog;
