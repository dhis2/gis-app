import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { closeDataTable, resizeDataTable } from '../actions/dataTable';
import { selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits } from '../actions/orgUnit';

const mapStateToProps = (state) => ({
    overlays: state.map.overlays, // TODO: Better to only pass overlay being edited?
    overlayId: state.dataTable,
    dataTableOpen: state.ui.dataTableOpen,
    dataTableHeight: state.ui.dataTableHeight,
    layersPanelOpen: state.ui.layersPanelOpen,
    width: state.ui.width,
    height: state.ui.height,
});

export default connect(
    mapStateToProps,
    { closeDataTable, resizeDataTable, selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits }
)(DataTable);
