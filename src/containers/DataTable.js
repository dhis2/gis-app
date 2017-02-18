import { connect } from 'react-redux';
import DataTable from '../components/datatable/DataTable';
import { basemapSelected } from '../actions';

// TODO: More elegant way?
const mapStateToProps = (state) => ({
    dataTableOpen: state.ui.dataTableOpen,
});

const mapDispatchToProps = ({
    onBasemapSelect: basemapSelected,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
