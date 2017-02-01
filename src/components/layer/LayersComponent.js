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

    // Runs after the widget has been rendered to the DOM
    componentDidMount() {

    }

    // Clean up when layer is removed
    componentWillUnmount() {

    }

    render() {
        const styles = {
            backgroundColor: 'red',
        };


        return (
            <SortableLayersList
                style={styles} // How to set on div?
                layers={this.state.layers}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}
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