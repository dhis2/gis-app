import { connect } from 'react-redux';
import Events from '../components/edit/Events';
import { loadPrograms, loadProgramTrackedEntityAttributes, loadProgramStages, loadProgramStageDataElements } from '../actions/programs';
import { loadOptionSet } from '../actions/optionSets';
import {
    setProgram,
    setProgramStage,
    setStyleDataItem,
    setEventCoordinateField,
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
        programAttributes: state.programTrackedEntityAttributes[programId],
        programStages: state.programStages[programId],
        dataElements: state.programStageDataElements[programStageId],
        optionSets: state.optionSets,
        orgUnitTree: state.orgUnitTree,
    };
};

export default connect(
    mapStateToProps,
    {
        loadPrograms,
        loadProgramTrackedEntityAttributes,
        loadProgramStages,
        loadProgramStageDataElements,
        loadOptionSet,
        setProgram,
        setProgramStage,
        setStyleDataItem,
        setEventCoordinateField,
        setEventClustering,
        setEventPointColor,
        setEventPointRadius
    }
)(Events);
