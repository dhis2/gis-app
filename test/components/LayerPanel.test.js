import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LayerPanel from '../../src/components/layers/LayersPanel';

describe('LayerPanel', () => {
    it('should render The layer panel', () => {
        const component = shallow(<LayerPanel />);
        const h1 = component.find('div > h1');

        expect(h1.text()).to.equal('The layer panel');
    });
});
