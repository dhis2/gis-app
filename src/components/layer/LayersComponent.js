import React, {Component} from 'react';
import {arrayMove} from 'react-sortable-hoc';
import SortableLayersList from './SortableLayersList';

const layers = [{
    id: '1',
    title: 'ANC 3 Coverage',
    subtitle: '2017',
    opacity: 0.8,
}, {
    id: '2',
    title: 'Facilitites',
    subtitle: 'Facility type',
    visible: false,
    expanded: true,
    opacity: 0.9,
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
    visible: false,
    expanded: true,
    opacity: 0.6,
    legend: {
        description: 'Precipitation collected from satellite and weather stations on the ground.',
        unit: 'millimeter',
        items: [{
            color: '#eff3ff',
            name : '0-20',
        },{
            color: '#c6dbef',
            name : '20-40',
        },{
            color: '#9ecae1',
            name : '40-60',
        },{
            color: '#6baed6',
            name : '60-80',
        },{
            color: '#3182bd',
            name : '80-100',
        },{
            color: '#08519c',
            name : '> 100',
        }]
    }
}, {
    id: '4',
    title: 'OSM Light',
    subtitle: 'Basemap',
    opacity: 1,
}];


// Container for sortable layers
export default class LayersComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {layers};

        // This binding is necessary to make `this` work in the callback
        this.onSortEnd = this.onSortEnd.bind(this);
    }

    onSortEnd({oldIndex, newIndex}) {
        let {layers} = this.state;

        this.setState({
            layers: arrayMove(layers, oldIndex, newIndex)
        });
    }

    // Runs after the widget has been rendered to the DOM
    componentDidMount() {

    }

    // Clean up when layer is removed
    componentWillUnmount() {

    }

    render() {
        return (
            <SortableLayersList
                layers={this.state.layers}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}
            />
        )
    }

};