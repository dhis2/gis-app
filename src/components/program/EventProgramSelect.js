import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProgramSelect from '../program/ProgramSelect';
import ProgramStageSelect from '../program/ProgramStageSelect';
import { loadPrograms, loadProgramStages } from '../../actions/programs';
import { setProgram, setProgramStage } from '../../actions/layerEdit';

const styles = {
    container: {
        flex: '100%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
    },
};

class EventProgramSelect extends Component {

    static propTypes = {
        program: PropTypes.object,
        programs: PropTypes.array,
        programStage: PropTypes.object,
        programStages: PropTypes.array,
        loadPrograms: PropTypes.func.isRequired,
        setProgram: PropTypes.func.isRequired,
        loadProgramStages: PropTypes.func.isRequired,
        setProgramStage: PropTypes.func.isRequired,
        style: PropTypes.object,
    };

    componentDidMount() {
        const { programs, loadPrograms } = this.props;

        if (!programs) {
            loadPrograms();
        }
    }

    componentDidUpdate() {
        const { program, programStage, programStages, loadProgramStages, setProgramStage } = this.props;

        // Load program stages when program is selected
        if (program && !programStages) {
            loadProgramStages(program.id);
        }

        // Select first program stage if only one
        if (!programStage && programStages && programStages.length === 1) {
            setProgramStage(programStages[0]);
        }
    }

    render() {
        const {
            program,
            programs,
            programStage,
            programStages,
            setProgram,
            setProgramStage,
            style,
        } = this.props;

        return (
            <div style={styles.container}>
                {programs &&
                    <ProgramSelect
                        program={program}
                        programs={programs}
                        setProgram={setProgram}
                        style={style}
                    />
                }
                {programStages &&
                    <ProgramStageSelect
                        programStage={programStage}
                        programStages={programStages}
                        setProgramStage={setProgramStage}
                        style={style}
                    />
                }
            </div>
        );
    }
}

export default connect(
    ({layerEdit, programs, programStages}) => ({
        program: layerEdit.program,
        programs,
        programStage: layerEdit.programStage,
        programStages: layerEdit.program ? programStages[layerEdit.program.id] : null,
    }),
    { loadPrograms, loadProgramStages, setProgram, setProgramStage }
)(EventProgramSelect);
