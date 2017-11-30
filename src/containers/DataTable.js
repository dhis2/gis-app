import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { selectOrgUnit, unselectOrgUnit } from '../actions/orgUnits';
import { setDataFilter, clearDataFilter } from '../actions/dataFilters';
import { filterData } from '../util/filter';

const mapStateToProps = (state) => {
    const overlay = state.dataTable ? state.map.overlays.filter(layer => layer.id === state.dataTable)[0] : null;

    if (overlay) {
        const data = filterData(overlay.data.map((d, i) => ({
            ...d.properties,
            index: i,
            type: d.geometry.type,
        })), overlay.dataFilters);

        return { data };
    }

    return null;
};

export default connect(
    mapStateToProps,
    { selectOrgUnit, unselectOrgUnit, setDataFilter, clearDataFilter }
)(DataTable);
