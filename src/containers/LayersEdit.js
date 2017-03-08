import { connect } from 'react-redux';
import LayersEdit from '../components/edit/LayersEdit';
import { updateOverlay, loadOverlay } from '../actions';

const mapStateToProps = (state) => ({
    ...state.map,
});

const mapDispatchToProps = ({
    onOverlayUpdate: loadOverlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersEdit);