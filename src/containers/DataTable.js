import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { closeDataTable } from '../actions/dataTable';

const mapStateToProps = (state) => ({
    overlays: state.map.overlays, // TODO: Better to only pass overlays being edited?
    overlayId: state.dataTable,
});

const mapDispatchToProps = ({
    onRequestClose: closeDataTable,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
