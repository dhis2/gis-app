import React from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import Layer from './Layer';

const SortableLayer = SortableElement(Layer);

export default SortableContainer(props => (
    <div>
        {props.layers.map((layer, index) =>
            <SortableLayer
                {...layer}
                key={`layer-${index}`}
                index={index}
            />
        )}
    </div>
));

