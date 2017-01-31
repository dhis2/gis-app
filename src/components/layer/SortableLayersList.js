import React, { Component } from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import SortableLayer from './SortableLayer';

// Sortable list of layers
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
                />
            )}
        </div>
    );
}

export default SortableContainer(SortableLayersList);


