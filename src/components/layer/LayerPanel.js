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
                    legend={layer.legend}
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
                subtitle: '26 - 28 Nov. 2016',
                legend: {
                    description: 'Precipitation collected from satellite and weather stations on the ground.',
                    unit: 'millimeter',
                    items: [{
                        color: '#eff3ff',
                        name : '0-20',
                    },{
                        color: '#c6dbef',
                        name : '20-40',
                    },{
                        color: '#9ecae1',
                        name : '40-60',
                    },{
                        color: '#6baed6',
                        name : '60-80',
                    },{
                        color: '#3182bd',
                        name : '80-100',
                    },{
                        color: '#08519c',
                        name : '> 100',
                    }]
                }
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

