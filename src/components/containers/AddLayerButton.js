import { connect } from 'react-redux'
import AddLayerButton from '../layer/AddLayerButton';
import { openLayersDialog } from '../actions';

const mapDispatchToProps = ({
    onClick: openLayersDialog,
});

export default connect(null, mapDispatchToProps)(AddLayerButton);






