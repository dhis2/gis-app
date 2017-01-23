import React, { Component } from 'react';
import LayerWidget from './LayerWidget';
import {SortableContainer, arrayMove} from 'react-sortable-hoc';

// Based on: https://github.com/clauderic/react-sortable-hoc/blob/master/examples/drag-handle.js

const SortableLayers = SortableContainer(({layers}) => {
    return (
        <div>
            {layers.map((layer, index) =>
                <LayerWidget
                    key={`layer-${index}`}
                    index={index}
                    title={layer.title}
                    subtitle={layer.subtitle}
                />
            )}
        </div>
    );
});


class SortableComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            layers: [{
                id: 1,
                title: 'ANC 3 Coverage',
                subtitle: '2017'
            }, {
                id: 2,
                title: 'Precipitation',
                subtitle: '26 - 28 Nov. 2016'
            }, {
                id: 3,
                title: 'OSM Light',
                subtitle: 'Basemap'
            }]
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
        let {layers} = this.state;

        return (
            <SortableLayers layers={layers} onSortEnd={this.onSortEnd} useDragHandle={true} />
        )
    }
}


export default SortableComponent;

