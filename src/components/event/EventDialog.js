import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import DataItemSelect from '../program/DataItemSelect';
import DataElementStyle from './DataElementStyle';

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
            styleDataElement,
            programStages,
            dataElements,
            optionSets,
            loadProgramStages,
            loadProgramStageDataElements,
            loadOptionSet,
            setProgramStage,
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
            // optionSets,
            styleDataElement,
            setProgram,
            setProgramStage,
            setStyleDataElement
        } = this.props;

        return (
            <Tabs>
                <Tab label='Data'>
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
                        {dataElements ?
                            <DataItemSelect
                                items={dataElements.filter(d => d.optionSet)}
                                value={styleDataElement ? styleDataElement.id : null}
                                onChange={setStyleDataElement}
                            />
                        : null}
                        {styleDataElement ?
                            <DataElementStyle
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
