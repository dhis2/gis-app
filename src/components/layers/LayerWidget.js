import React from 'react';
import Legend from '../legend/Legend';

function LayerHeader () {
    return (<div>Facility</div>);
}

function LayerToolbar () {
    return (<div>Toolbar</div>);
}

export default function LayerWidget() {
    return (
        <div>
            <LayerHeader />
            <Legend />
            <LayerToolbar />
        </div>
    );
}
