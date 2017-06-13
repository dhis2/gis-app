import { connect } from 'react-redux';
import LayersToggle from '../components/layers/LayersToggle'
import { openLayersPanel, closeLayersPanel } from '../actions/ui';

const mapStateToProps = (state) => ({
    isOpen: state.ui.layersPanelOpen,
});

export default connect(
    mapStateToProps,
    { openLayersPanel, closeLayersPanel, }
)(LayersToggle);
