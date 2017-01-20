import React from 'react';
import { render } from 'react-dom';

import LayerPanel from '../src/components/layers/LayerPanel';
import Legend from '../src/components/legend/Legend';
import LayerWidget from '../src/components/layers/LayerWidget';

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
        <ComponentExamples>
            <ComponentExample>
                <LayerPanel>
                    <LayerWidget />
                    <LayerWidget />
                    <LayerWidget />
                    <LayerWidget />
                </LayerPanel>
            </ComponentExample>
            <ComponentExample>
                <LayerWidget />
            </ComponentExample>
        </ComponentExamples>
    );
}

render(<GISComponents />, document.getElementById('examples'));