import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();

import GisApp from '../src/react';

import './styles/material-override.css';

import LayersComponent from '../src/react/components/layer/LayersComponent';
import LayerToolbar from '../src/react/components/layer/LayerToolbar';
import Legend from '../src/react/components/legend/Legend';
import Layer from '../src/react/components/layer/Layer';
import Basemaps from '../src/react/components/layer/Basemaps';
// import AddLayerButton from '../src/components/layer/AddLayerButton';
import AddLayerDialog from '../src/react/components/layer/AddLayerDialog';
import DataTable from '../src/react/components/datatable/DataTable';

const layers = [{
    id: '1',
    title: 'ANC 3 Coverage',
    subtitle: '2017',
    opacity: 0.8,
    expanded: false,
    legend: {
        items: [{
            color: '#ffffb2',
            name: 'Low',
            range: '0 - 40 (0)'
        },{
            color: '#fed976',
            name : 'Medium',
            range: '40 - 60 (1)',
        },{
            color: '#feb24c',
            name : 'Medium plus',
            range: '60 - 70 (1)',
        },{
            color: '#fd8d3c',
            name : 'High',
            range: '70 - 80 (0)',
        },{
            color: '#f03b20',
            name : 'High plus',
            range: '80 - 90 (4)',
        },{
            color: '#bd0026',
            name : 'Great',
            range: '90 - 120 (5)',
        }]
    }
}, {
    id: '2',
    title: 'Facilitites',
    subtitle: 'Facility type',
    opacity: 0.9,
    visible: false,
    expanded: false,
    legend: {
        items: [{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/08.png',
            name : 'CHP',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/16.png',
            name : 'CHC',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/10.png',
            name : 'MCHP',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/14.png',
            name : 'Clinic',
        },{
            image: 'https://play.dhis2.org/dev/images/orgunitgroup/05.png',
            name : 'Hospital',
        }]
    }
}, {
    id: '3',
    title: 'Precipitation',
    subtitle: '26 - 28 Nov. 2016',
    opacity: 0.6,
    visible: false,
    expanded: false,
    legend: {
        description: 'Precipitation collected from satellite and weather stations on the ground.',
        unit: 'millimeter',
        items: [{
            color: '#eff3ff',
            range : '0 - 20',
        },{
            color: '#c6dbef',
            range : '20 - 40',
        },{
            color: '#9ecae1',
            range : '40 - 60',
        },{
            color: '#6baed6',
            range : '60 - 80',
        },{
            color: '#3182bd',
            range : '80 - 100',
        },{
            color: '#08519c',
            range : '> 100',
        }],
        source: 'UCSB / CHG / Google Earth Engine',
        sourceUrl: 'https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD',
    }
}, {
    id: '4',
    type: 'basemap',
    title: 'OSM Light',
    subtitle: 'Basemap',
    opacity: 1,
}];


function ComponentExamples({ children }) {
    return (
        <div style={{ flexWrap: 'wrap' }}>
          {children}
        </div>
    );
}

function ComponentExample({ children }) {
    return (
        <div style={{ padding:  '2rem', border: '1px solid #CCC' }}>
            {children}
        </div>
    ); 
}


function GISComponents() {
    return (
        <MuiThemeProvider>
            <ComponentExamples>
                <ComponentExample>
                    <h2>Layers component</h2>
                    <LayersComponent layers={layers} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Legend colors</h2>
                    <Legend {...layers[2].legend} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Legend colors</h2>
                    <Legend {...layers[0].legend} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Legend symbols</h2>
                    <Legend {...layers[1].legend} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Layer toolbar</h2>
                    <LayerToolbar
                        onEdit={() => {}}
                        onSearch={() => {}}
                        onFilter={() => {}}
                        onOpacityChange={() => {}}
                        onDelete={() => {}}
                        opacity={0.8}
                    />
                </ComponentExample>
                <ComponentExample>
                    <h2>Layer</h2>
                    <Layer {...layers[0]} subtitle={undefined} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Layer</h2>
                    <Layer {...layers[0]} visible={false} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Layer</h2>
                    <Layer {...layers[0]} expanded={true} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Basemaps</h2>
                    <Basemaps />
                </ComponentExample>
                <ComponentExample>
                    <h2>Add new layer</h2>
                    <AddLayerDialog open={false} />
                </ComponentExample>
                <ComponentExample>
                    <h2>Data table</h2>
                    <DataTable open={false} />
                </ComponentExample>
            </ComponentExamples>
        </MuiThemeProvider>
    );
}


// render(<GISComponents />, document.getElementById('examples'));



