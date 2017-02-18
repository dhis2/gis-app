import React, {Component} from 'react';
import {arrayMove} from 'react-sortable-hoc';
import SortableLayersList from './SortableLayersList';

// Container for sortable layers
export default class LayersComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            layers: props.layers
        };

        this.onSortEnd = this.onSortEnd.bind(this);
    }

    onSortEnd({oldIndex, newIndex}) {
        let {layers} = this.state;

        this.setState({
            layers: arrayMove(layers, oldIndex, newIndex)
        });
    }

    render() {
        return (
            <SortableLayersList
                layers={this.state.layers}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}
                {...this.props}
            />
        )
    }

};

LayersComponent.propTypes= {
    layers: React.PropTypes.array,
};

LayersComponent.defaultProps = {
    layers: [],
};