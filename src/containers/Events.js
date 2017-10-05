import { connect } from 'react-redux';
import Events from '../components/edit/Events';
import { loadPrograms, loadProgramStages, loadProgramStageDataElements } from '../actions/programs';
import { loadOptionSet } from '../actions/optionSets';
import {
    setProgram,
    setProgramStage,
    setStyleDataElement,
    setEventClustering,
    setEventPointColor,
    setEventPointRadius
} from '../actions/layerEdit';

const mapStateToProps = (state) => {
    const layer = state.layerEdit;
    const programId = layer.program ? layer.program.id : null;
    const programStageId = layer.programStage ? layer.programStage.id : null;

    return {
        programs: state.programs,
        programStages: state.programStages[programId],
        dataElements: state.programStageDataElements[programStageId], // Remove filter
        optionSets: state.optionSets,
    };
};

export default connect(
    mapStateToProps,
    {
        loadPrograms,
        loadProgramStages,
        loadProgramStageDataElements,
        loadOptionSet,
        setProgram,
        setProgramStage,
        setStyleDataElement,
        setEventClustering,
        setEventPointColor,
        setEventPointRadius
    }
)(Events);