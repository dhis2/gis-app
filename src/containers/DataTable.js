import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { closeDataTable } from '../actions/dataTable';

const mapStateToProps = (state) => ({
    dataList: state.dataTable.data,
    dataTableOpen: state.dataTable.open,
});

const mapDispatchToProps = ({
    onRequestClose: closeDataTable,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
