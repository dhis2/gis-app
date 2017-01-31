import React, { Component } from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import SortableLayer from './SortableLayer';

// Returns sortable list of layers
function SortableLayersList(props) {
    return (
        <div>
            {props.layers.map((layer, index) =>
                <SortableLayer
                    key={`layer-${index}`}
                    index={index}
                    title={layer.title}
                    subtitle={layer.subtitle}
                    legend={layer.legend}
                    opacity={layer.opacity}
                    visible={layer.visible}
                    expanded={layer.expanded}
                />
            )}
        </div>
    );
}

export default SortableContainer(SortableLayersList);


