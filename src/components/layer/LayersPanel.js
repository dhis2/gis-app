import React, { PropTypes } from 'react'
//import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Layer from './Layer';
import AddLayer from '../containers/AddLayer';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const SortableLayer = SortableElement(Layer);

const SortableLayersList = SortableContainer(({layers}) => {
    console.log(layers);

    return (
        <div>
            {layers.map((layer, index) =>
                <SortableLayer
                    {...layer}
                    key={`layer-${index}`}
                    index={index}
                />
            )}
            <AddLayer />
        </div>
    );
});

const LayersPanel = ({ layers, onSortEnd }) => (
    <SortableLayersList
        layers={layers}
        onSortEnd={onSortEnd}
        useDragHandle={true}
    />
);

/*
LayersList.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        expanded: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired).isRequired,
    onLayerClick: PropTypes.func.isRequired
}
*/

export default LayersPanel;