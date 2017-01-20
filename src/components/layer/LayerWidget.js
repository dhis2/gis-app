import React from 'react';
import LayerHeader from './LayerHeader';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';


export default function LayerWidget() {
    return (
        <div>
            <LayerHeader title="Rainfall 26 - 28 Nov." />
            <Legend />
            <LayerToolbar />
        </div>
    );
}
