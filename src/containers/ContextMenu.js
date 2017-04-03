import { connect } from 'react-redux';
import ContextMenu from '../components/map/ContextMenu';
import { closeContextMenu } from '../actions/map';

const mapStateToProps = state => ({
    ...state.contextMenu
});

const mapDispatchToProps = ({
    onRequestClose: closeContextMenu,
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
