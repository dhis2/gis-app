import { connect } from 'react-redux';
import LayersPanel from '../components/layer/LayersPanel'
import { sortLayers } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

const mapDispatchToProps = ({
    onSortEnd: sortLayers,
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersPanel);
