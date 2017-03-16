import { connect } from 'react-redux';
import LayersEdit from '../components/edit/LayersEdit';
import { updateOverlay, loadOverlay } from '../actions';

const mapStateToProps = (state) => ({
    layer: state.editOverlay,
});

const mapDispatchToProps = ({
    loadOverlay: loadOverlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersEdit);