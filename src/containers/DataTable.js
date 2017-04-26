import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { closeDataTable } from '../actions/dataTable';
import { selectOrgUnit, unselectOrgUnit } from '../actions/orgUnit';

const mapStateToProps = (state) => ({
    overlays: state.map.overlays, // TODO: Better to only pass overlays being edited?
    overlayId: state.dataTable,
});

const mapDispatchToProps = ({
    closeDataTable,
    selectOrgUnit,
    unselectOrgUnit
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
