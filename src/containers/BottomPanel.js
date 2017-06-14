import { connect } from 'react-redux';
import BottomPanel from '../components/datatable/BottomPanel';
import { closeDataTable, resizeDataTable } from '../actions/dataTable';

const mapStateToProps = (state) => ({
    dataTableOpen: state.dataTable ? true : false,
    dataTableHeight: state.ui.dataTableHeight,
    layersPanelOpen: state.ui.layersPanelOpen,
    width: state.ui.width,
    height: state.ui.height,
});

export default connect(
    mapStateToProps,
    { closeDataTable, resizeDataTable, }
)(BottomPanel);
