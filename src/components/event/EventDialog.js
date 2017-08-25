import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
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

        if (program) {
            if (program.stages && this.state.stages !== program.stages) {
                const stage = program.stages.filter(s => s.id === this.state.programStageId)[0];

                this.setState({
                   stages: program.stages,
                   dataElements: stage ? stage.dataElements : [],
                });
            }
        }
    }

    onProgramSelect(programId) {
        const program = this.props.programs.filter(p => p.id === programId)[0];

        if (!program.stages) {
            this.props.loadProgramStages(program.id);
        }

        this.setState({ programId });
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
            <Dialog
                title='Event layer' // TODO: i18n
                bodyStyle={styles.body}
                titleStyle={styles.title}
                open={true}
            >
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
                    <Tab label='Options'>
                        <div style={styles.content}>
                            <p>Style by data item</p>
                            <p>Filter</p>
                        </div>
                    </Tab>
                </Tabs>
            </Dialog>
        );
    }
}

export default EventDialog;
