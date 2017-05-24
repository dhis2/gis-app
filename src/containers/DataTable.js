import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { closeDataTable } from '../actions/dataTable';
import { selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits } from '../actions/orgUnit';

const mapStateToProps = (state) => ({
    overlays: state.map.overlays, // TODO: Better to only pass overlay being edited?
    overlayId: state.dataTable,
    dataTableSize: state.ui.dataTableSize,
    width: state.ui.width,
    layersPanelOpen: state.ui.layersPanelOpen,
});

export default connect(
    mapStateToProps,
    { closeDataTable, selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits }
)(DataTable);
