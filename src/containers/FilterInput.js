import { connect } from 'react-redux';
import FilterInput from '../components/datatable/FilterInput';
import { setDataFilter, clearDataFilter } from '../actions/dataFilters';

// Avoid needing to pass filter and actions to every input field
const mapStateToProps = (state) => {
    const overlay = state.dataTable ? state.map.overlays.filter(layer => layer.id === state.dataTable)[0] : null;

    if (overlay) {
        return {
            layerId: overlay.id,
            filters: overlay.dataFilters
        }
    }

    return null;
};

export default connect(
    mapStateToProps,
    { setDataFilter, clearDataFilter }
)(FilterInput);
