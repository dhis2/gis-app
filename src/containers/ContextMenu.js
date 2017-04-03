import { connect } from 'react-redux';
import ContextMenu from '../components/map/ContextMenu';
import { closeContextMenu } from '../actions/map';
import { drillOverlay } from '../actions/overlays';

const mapStateToProps = state => ({
    ...state.contextMenu
});

const mapDispatchToProps = ({
    onRequestClose: closeContextMenu,
    onDrill: drillOverlay,
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
