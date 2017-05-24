import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits } from '../actions/orgUnit';

const mapStateToProps = (state) => ({
    overlay: state.dataTable ? state.map.overlays.filter(layer => layer.id === state.dataTable)[0] : null,
});

export default connect(
    mapStateToProps,
    { selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits }
)(DataTable);
