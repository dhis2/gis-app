import { connect } from 'react-redux';
import Events from '../components/edit/Events';
import { loadProgramTrackedEntityAttributes, loadProgramStageDataElements } from '../actions/programs';
import { loadOptionSet } from '../actions/optionSets';
import {
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
        loadProgramTrackedEntityAttributes,
        loadProgramStageDataElements,
        loadOptionSet,
        setStyleDataItem,
        setEventCoordinateField,
        setEventClustering,
        setEventPointColor,
        setEventPointRadius
    }
)(Events);
