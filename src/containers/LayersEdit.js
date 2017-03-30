import { connect } from 'react-redux';
import LayersEdit from '../components/edit/LayersEdit';
import { getOverlay } from '../actions/overlays';

const mapStateToProps = (state) => ({
    layer: state.editOverlay,
});

const mapDispatchToProps = ({
    loadOverlay: getOverlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersEdit);