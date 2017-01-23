import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import LayerPanel from '../src/components/layer/LayerPanel';
import Legend from '../src/components/legend/Legend';
import LayerWidget from '../src/components/layer/LayerWidget';


function ComponentExamples({ children }) {
    return (
        <div style={{ display:  'flex', flexWrap: 'wrap' }}>
          {children}
        </div>
    );
}

function ComponentExample({ children }) {
    return (
        <div style={{ flex: '1 1 auto', padding:  '2rem', border: '1px solid #CCC' }}>
            {children}
        </div>
    ); 
}

function GISComponents() {
    return (
        <MuiThemeProvider>
            <LayerPanel>
                <LayerWidget
                    title="Precipitation"
                    subtitle="26 - 28 Nov."
                />
                <LayerWidget
                    title="ANC 3 Coverage"
                    subtitle="2017"
                />
                <LayerWidget
                    title="OSM Light"
                    subtitle="Basemap"
                />
            </LayerPanel>
        </MuiThemeProvider>
    );
}

/*
function GISComponents() {
    return (
        <MuiThemeProvider>
            <ComponentExamples>
                <ComponentExample>
                    <LayerPanel>
                        <LayerWidget title="Rainfall 26 - 28 Nov." />
                    </LayerPanel>
                </ComponentExample>
                <ComponentExample>
                </ComponentExample>
            </ComponentExamples>
        </MuiThemeProvider>
    );
}
*/


render(<GISComponents />, document.getElementById('examples'));