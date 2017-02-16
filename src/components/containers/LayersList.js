import { connect } from 'react-redux';
import LayersPanel from '../layer/LayersPanel'
import { sortLayers } from '../actions';

const mapStateToProps = (state) => ({
    layers: state.layers,
});

/*
const mapStateToProps = function(state) {
    console.log('state', state);

    return {
        layers: state.layers,
    }
}
*/


const mapDispatchToProps = ({
    onSortEnd: sortLayers,
});

const LayersList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(LayersPanel);

export default LayersList;