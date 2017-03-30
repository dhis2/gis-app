import { connect } from 'react-redux'
import AddLayerButton from '../components/layer/AddLayerButton';
import { openOverlaysDialog } from '../actions/overlays';

const mapDispatchToProps = ({
    onClick: openOverlaysDialog,
});

export default connect(null, mapDispatchToProps)(AddLayerButton);






